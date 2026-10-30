const VOICES = ['bass', 'piano', 'synth'];
// Eighth-note pulses at 60 BPM. Four bars per chord share one harmonic clock.
const CHORDS = [[9, 0, 4, 7], [5, 9, 0, 4], [0, 4, 7, 11], [7, 11, 2, 4]];
const PATTERNS = {
  bass: [0, 0, 2, 0, 0, 3, 2, 0],
  piano: [0, 1, 2, 3, 2, 1, 3, 1],
  synth: [2, 3, 1, 2, 0, 2, 3, 1]
};
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const frequencyForMidi = midi => 440 * 2 ** ((midi - 69) / 12);

/** Original deterministic phrases: all emitters share the same chord at a given pulse. */
export function noteForPulse(voice, step, seed = 0) {
  if (!VOICES.includes(voice)) throw new RangeError('Voice must be bass, piano or synth.');
  if (!Number.isSafeInteger(step) || step < 0 || !Number.isSafeInteger(seed) || seed < 0) {
    throw new RangeError('Pulse step and seed must be nonnegative safe integers.');
  }
  const chord = CHORDS[Math.floor(step / 16) % CHORDS.length];
  const offset = seed % 8;
  const pitchClass = chord[PATTERNS[voice][(step % 8 + offset) % 8]];
  // Keep a distinct, predictable register per instrument; no score or learned model.
  return (voice === 'bass' ? 36 : voice === 'piano' ? 60 : 72) + pitchClass;
}

/** Procedural pulse instrument. Construct/resume from a browser user gesture. */
export class LofiAudio {
  constructor(context) {
    const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!context && !Context) throw new Error('Web Audio is unavailable.');
    this.context = context || new Context();
    this._ownsContext = !context;
    this._muted = false;
    this._disposed = false;
    this._voices = new Map();
    this._records = new Set();
    this._serial = 0;
    this._played = 0;
    this._peak = 0;
    this._dropped = 0;
    this._counts = { bass: 0, piano: 0, synth: 0 };
    this._lastNote = null;

    const ctx = this.context;
    this.input = ctx.createGain();
    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 4200;
    this.filter.Q.value = 0.45;
    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -19;
    this.compressor.knee.value = 18;
    this.compressor.ratio.value = 5;
    this.compressor.attack.value = 0.008;
    this.compressor.release.value = 0.2;
    this.master = ctx.createGain();
    this.master.gain.value = 0.42;
    this.input.connect(this.filter);
    this.filter.connect(this.compressor);
    this.compressor.connect(this.master);
    this.master.connect(ctx.destination);

    this._graph = [this.input, this.filter, this.compressor, this.master];
    this._echoNodes = [];
    this._buildEcho();
  }

  _buildEcho(silentUntil = this.context.currentTime) {
    const ctx = this.context;
    this.echoGate = ctx.createGain();
    this.echoGate.gain.value = 0;
    this.echoGate.gain.setValueAtTime(1, silentUntil);
    this.delay = ctx.createDelay(1);
    this.delay.delayTime.value = 0.375;
    this.wet = ctx.createGain();
    this.wet.gain.value = 0.12;
    this.feedback = ctx.createGain();
    this.feedback.gain.value = 0.18;
    this.echoFilter = ctx.createBiquadFilter();
    this.echoFilter.type = 'lowpass';
    this.echoFilter.frequency.value = 1800;
    this.filter.connect(this.echoGate);
    this.echoGate.connect(this.delay);
    this.delay.connect(this.wet);
    this.wet.connect(this.compressor);
    this.delay.connect(this.echoFilter);
    this.echoFilter.connect(this.feedback);
    this.feedback.connect(this.delay);
    this._echoNodes = [this.echoGate, this.delay, this.wet, this.feedback, this.echoFilter];
  }

  async resume() {
    if (this._disposed) return false;
    if (this.context.state !== 'running') await this.context.resume();
    return this.context.state === 'running';
  }

  setMuted(value) {
    if (typeof value !== 'boolean') throw new TypeError('Muted must be boolean.');
    if (this._disposed) return;
    this._muted = value;
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(value ? 0 : 0.42, now, 0.018);
    if (value) this.silence();
  }

  silence() {
    if (this._disposed) return;
    const now = this.context.currentTime;
    for (const record of [...this._records]) this._release(record, now);
    // A delay retains samples after its sources stop. Replace that branch so a
    // restored moment cannot inherit echoes from the version that preceded it.
    this.filter.disconnect(this.echoGate);
    for (const node of this._echoNodes) node.disconnect();
    this._buildEcho(now + 0.035); // Do not re-record the 25 ms voice release.
  }

  _cleanup(record) {
    if (record.cleaned) return;
    record.cleaned = true;
    this._voices.delete(record.id);
    this._records.delete(record);
    for (const node of record.nodes) node.disconnect();
  }

  _release(record, now) {
    if (record.released) return;
    record.released = true;
    record.envelope.gain.cancelScheduledValues(now);
    record.envelope.gain.setTargetAtTime(0, now, 0.004);
    for (const osc of record.oscillators) {
      try { osc.stop(now + 0.025); } catch { /* An already ended note is harmless. */ }
    }
    // Keep the live pool bounded even during a burst of 24 simultaneous emitters.
    this._voices.delete(record.id);
  }

  pulse({ voice, step, seed = 0, velocity = 0.7 } = {}) {
    const midi = noteForPulse(voice, step, seed);
    if (!Number.isFinite(velocity)) throw new TypeError('Velocity must be finite.');
    if (this._disposed || this._muted || this.context.state !== 'running') return null;
    const ctx = this.context, now = ctx.currentTime + 0.004;
    while (this._voices.size >= 32) {
      this._dropped++;
      this._release(this._voices.values().next().value, now);
    }
    // At most eight short fade-outs can coexist with the 32-note live pool.
    // A rapid input burst cannot allocate an unbounded queue of retiring nodes.
    while (this._records.size >= 40) {
      const oldest = [...this._records].find(record => record.released);
      if (!oldest) break;
      this._cleanup(oldest);
    }

    const frequency = frequencyForMidi(midi), level = clamp(velocity, 0, 1);
    if (level === 0) return null;
    const envelope = ctx.createGain();
    envelope.gain.value = 0.00001;
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = voice === 'bass' ? 520 : voice === 'piano' ? 3200 : 1900;
    tone.Q.value = voice === 'synth' ? 0.8 : 0.35;
    envelope.connect(tone);tone.connect(this.input);
    const duration = voice === 'bass' ? 0.47 : voice === 'piano' ? 1.15 : 1.4;
    const peak = (voice === 'bass' ? 0.2 : voice === 'piano' ? 0.14 : 0.075) * level;
    envelope.gain.setValueAtTime(0.00001, now);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.00002, peak), now + (voice === 'synth' ? 0.07 : 0.008));
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.00002, peak * (voice === 'bass' ? 0.38 : 0.22)), now + duration * 0.32);
    envelope.gain.exponentialRampToValueAtTime(0.00001, now + duration);

    const id = ++this._serial;
    const record = { id, envelope, nodes: [envelope, tone], oscillators: [], cleaned: false, released: false };
    const partials = voice === 'piano' ? [[1, 1], [2, 0.26], [3, 0.09]] :
      voice === 'synth' ? [[1, 0.5, -5], [1, 0.5, 5]] : [[1, 1]];
    for (const [ratio, gain, detune = 0] of partials) {
      const osc = ctx.createOscillator(), mix = ctx.createGain();
      osc.type = voice === 'bass' ? 'triangle' : voice === 'synth' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(frequency * ratio, now);
      // A tiny, deterministic tape-like pitch drift, rather than a continuous drone.
      osc.detune.setValueAtTime(detune + Math.sin(seed * 0.7 + step * 0.23) * 2.5, now);
      osc.detune.linearRampToValueAtTime(detune + Math.sin(seed * 0.7 + step * 0.23 + 1.3) * 2.5, now + duration);
      mix.gain.value = gain;
      osc.connect(mix);mix.connect(envelope);
      record.oscillators.push(osc);record.nodes.push(osc, mix);
    }
    this._voices.set(id, record);
    this._records.add(record);
    this._peak = Math.max(this._peak, this._voices.size);
    let ended = 0;
    for (const osc of record.oscillators) {
      osc.onended = () => { if (++ended === record.oscillators.length) this._cleanup(record); };
      osc.start(now);osc.stop(now + duration + 0.025);
    }
    this._played++;this._counts[voice]++;
    this._lastNote = { voice, midi, frequency, step, seed };
    return { ...this._lastNote };
  }

  getStats() {
    return { active: this._voices.size, retiring: this._records.size - this._voices.size,
      maxPolyphony: 32, peak: this._peak, dropped: this._dropped, notesPlayed: this._played,
      perVoice: { ...this._counts }, muted: this._muted, disposed: this._disposed,
      contextState: this.context.state, lastNote: this._lastNote ? { ...this._lastNote } : null };
  }

  async dispose() {
    if (this._disposed) return;
    this._disposed = true;
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);this.master.gain.setValueAtTime(0, now);
    for (const record of [...this._records]) {
      for (const osc of record.oscillators) { try { osc.stop(now); } catch { /* Already stopped. */ } }
      this._cleanup(record);
    }
    for (const node of [...this._graph, ...this._echoNodes]) node.disconnect();
    if (this._ownsContext && this.context.state !== 'closed') await this.context.close();
  }
}

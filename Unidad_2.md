# Proyecto: Protección vs. Destrucción


Mi primera idea era que existiera un núcleo que debía ser protegido y un grupo de partículas encargadas de defenderlo de otras partículas que representaban una amenaza.

## Primera versión

<img width="1242" height="1096" alt="image" src="https://github.com/user-attachments/assets/e48bbd58-c7c2-48b7-8ab5-3a513dd3bf5f" />

La primera versión era bastante sencilla.

Había un núcleo en el centro, un grupo de protectores que lo seguían constantemente y unos perturbadores que aparecían desde los bordes.

En esta etapa el comportamiento era muy básico porque los protectores simplemente perseguían el núcleo y los perturbadores intentaban acercarse.

Visualmente funcionaba, pero al observar la simulación me di cuenta de que realmente no estaba comunicando la contradicción que quería representar.

Parecía más una simulación de seguimiento que un sistema generativo.



## Primeros problemas encontrados

<img width="1238" height="1094" alt="image" src="https://github.com/user-attachments/assets/fd4531cc-ddcd-4fb5-bb95-36fba672bec7" />

Durante las primeras pruebas aparecieron varios problemas.

Los protectores terminaban agrupándose demasiado sobre el núcleo.

En otras ocasiones la fuerza de repulsión hacía que todos salieran disparados hacia los bordes de la pantalla.

También observé que los perturbadores casi no influían en el comportamiento general, por lo que su presencia no modificaba realmente el sistema.

En ese momento comprendí que no bastaba con cambiar parámetros como la velocidad o la fuerza. El problema estaba en las reglas de interacción.

## Cambio de enfoque

Después de varias pruebas decidí dejar de pensar en trayectorias y comenzar a pensar en relaciones entre partículas.

La intención pasó a ser construir un sistema donde el comportamiento surgiera únicamente de reglas locales.

En lugar de hacer que todas las partículas siguieran directamente al núcleo, empecé a trabajar con relaciones de atracción, repulsión y distancias de interacción, buscando un comportamiento más cercano a Particle Life.

## Rediseño del sistema

Decidí reorganizar completamente el proyecto.

En vez de escribir condiciones independientes para cada tipo de partícula, construí una matriz de relaciones donde cada población define cómo interactúa con las demás.

Esto permitió que el comportamiento fuera mucho más fácil de controlar y modificar.

También incorporé:

velocidades máximas,
aceleración,
fricción,
radios de interacción,
variabilidad entre ejecuciones,
ruido para hacer el movimiento más orgánico.

Cada ejecución comenzó a producir resultados diferentes sin perder la identidad del sistema.

## Organización de los protectores

Uno de los cambios más importantes fue modificar el comportamiento de los protectores.

Inicialmente todos perseguían directamente al núcleo.

Después cambié esta lógica para que intentaran mantener una distancia determinada alrededor de él.

Esto permitió formar un anillo estable que podía reorganizarse cuando aparecían amenazas.

Este cambio hizo que el comportamiento fuera mucho más emergente y menos predecible.

##Contradicción incorporada en las reglas

Uno de los objetivos principales era que la contradicción no dependiera únicamente del color de las partículas.

Por esa razón diseñé las reglas para que el peligro no proviniera directamente de los perturbadores.

Cuando aparecen amenazas, los protectores intentan reorganizarse para defender el núcleo.

Sin embargo, al concentrarse demasiado y cerrar completamente el anillo terminan ejerciendo presión sobre aquello que intentan proteger.

De esta manera la destrucción aparece como consecuencia de las propias reglas del sistema y no porque exista una animación programada.

## Cambios visuales

También hice varias modificaciones en la parte visual.

Añadí halos luminosos, estelas y diferentes colores para distinguir las poblaciones.

Aunque estos elementos ayudan a comprender la simulación, procuré que la contradicción no dependiera únicamente de ellos sino del comportamiento del sistema.

## Interacción

Inicialmente la interacción con el mouse hacía aparecer una amenaza similar a un perturbador.

Después decidí cambiar este comportamiento.

Ahora, al hacer clic, el usuario crea temporalmente un nuevo núcleo de atracción.

Con este cambio el usuario no controla directamente las partículas, sino que modifica las relaciones del sistema, permitiendo observar nuevas reorganizaciones sin romper la lógica generativa.

## Descartes

Durante el desarrollo descarté varias ideas.

Una de ellas fue hacer que todos los protectores persiguieran siempre a los perturbadores, ya que esto producía movimientos demasiado caóticos y eliminaba la estructura del sistema.

También descarté utilizar trayectorias programadas manualmente porque el objetivo de la unidad era construir un comportamiento emergente y no una animación fija.

Otra idea descartada fue controlar completamente las explosiones mediante temporizadores. Finalmente preferí que aparecieran como consecuencia del estado del sistema y de las reglas establecidas.



<img width="1239" height="1093" alt="image" src="https://github.com/user-attachments/assets/7cb7766a-33ea-4bb9-9d9b-a47c629a7622" />

| **Criterio**                                                                      | **Peso** | **Valoración** | **Aporte**                                                                                                   |
| --------------------------------------------------------------------------------- | :------: | :------------: | ------------------------------------------------------------------------------------------------------------ |
| La intención es clara y perceptible en el comportamiento.                         |    20%   |    5   | La contradicción entre protección y destrucción se entiende a través del comportamiento de las partículas.   |
| Los tipos, cantidades, matriz y parámetros están justificados desde la intención. |    25%   |    5   | tiene que haber un numero mayor de protectores para que se evidencie la contradiccion       |
| Comprendo y puedo modificar el funcionamiento técnico del sistema.                |    20%   |    5  | puedo modificar reglas, parámetros e interacciones durante el desarrollo. |
| El sistema produce variaciones con una identidad reconocible.                     |    15%   |    5   | Cada ejecución es diferente, pero siempre mantiene el mismo comportamiento general.                          |
| Experimenté, comparé, seleccioné y descarté con criterios claros.                 |    10%   |      4    | hice varios intentos y descarte opciones de diseño             |
| Puedo distinguir y sustentar lo diseñado y lo emergente.                          |    10%   |   5  | Las reglas fueron diseñadas por mí, el comportamiento es consecuencia de eso     |

## codigo

/* ===========================================================
   PROTECCIÓN VS DESTRUCCIÓN (Modificado)
   p5.js
   
   NUEVA FUNCIONALIDAD:
   - El clic actúa como un Núcleo Atractor en tiempo real.
   - Si las partículas azules tocan o quedan encima de cualquier
     núcleo (incluido el del cursor), este explota inmediatamente.
   =========================================================== */

// ===============================
// PARÁMETROS GENERALES
// ===============================

const NUM_NUCLEI = 2;
const NUM_PROTECTORS = 200;
const NUM_PERTURBERS = 30;

const PROTECTOR_RADIUS = 5;
const PERTURBER_RADIUS = 4;
const NUCLEUS_RADIUS = 18;

const MAX_SPEED_PROTECTOR = 100;
const MAX_SPEED_PERTURBER = 2.0;
const MAX_SPEED_NUCLEUS = 1.5;

const FRICTION = 0.93;
const TRAIL_ALPHA = 8;

const RING_RADIUS_BASE = 125;
const RING_RADIUS_VARIATION = 18;

const WANDER_PROTECTOR = 0.025;
const WANDER_PERTURBER = 0.045;

// ===============================
// MATRIZ DE RELACIONES
// ===============================

const RELATIONS = {
    protector: {
        nucleus:   { type: "spring",       k: 0.018, range: null, maxForce: 0.12 },
        protector: { type: "repulsion",    k: 1.1,   range: 46,   maxForce: 0.16 },
        perturber: { type: "attraction",   k: 0.9,   range: 190,  maxForce: 0.16 }
    },
    perturber: {
        nucleus:   { type: "attraction",   k: 0.03,  range: 260,  maxForce: 0.03 },
        protector: { type: "repulsion",    k: 1.0,   range: 100,  maxForce: 0.18 },
        perturber: { type: "indifference", k: 0,     range: 0,    maxForce: 0    }
    },
    nucleus: {
        protector: { type: "repulsion",    k: 0.6,   range: RING_RADIUS_BASE + RING_RADIUS_VARIATION + 40, maxForce: 0.4 },
        perturber: { type: "indifference", k: 0,     range: 0,    maxForce: 0    },
        nucleus:   { type: "indifference", k: 0,     range: 0,    maxForce: 0    }
    }
};

// ===============================
// VARIABLES GLOBALES
// ===============================

let nuclei = [];
let protectors = [];
let perturbers = [];
let mouseNucleus = null;

let waveSide = 0;
let nextWaveChange = 0;

// ===============================
// SETUP
// ===============================

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(RGB);
    smooth();
    background(5);

    RELATIONS.perturber.nucleus.range = dist(0, 0, width, height) + 100;

    // Núcleos autónomos iniciales
    nuclei = [];
    for (let i = 0; i < NUM_NUCLEI; i++) {
        let nx = width * (i + 1) / (NUM_NUCLEI + 1);
        let ny = height / 2 + random(-height * 0.15, height * 0.15);
        nuclei.push(new Nucleus(nx, ny));
    }

    waveSide = floor(random(4));
    nextWaveChange = floor(random(240, 540));

    // Crear Protectores
    for (let i = 0; i < NUM_PROTECTORS; i++) {
        let home = nuclei[i % nuclei.length];
        let angle = random(TWO_PI);
        let ringR = RING_RADIUS_BASE + random(-RING_RADIUS_VARIATION, RING_RADIUS_VARIATION);
        let x = home.position.x + cos(angle) * ringR;
        let y = home.position.y + sin(angle) * ringR;
        protectors.push(new Particle(x, y, "protector", ringR));
    }

    // Crear Perturbadores
    for (let i = 0; i < NUM_PERTURBERS; i++) {
        let pos = spawnEdgePosition();
        perturbers.push(new Particle(pos.x, pos.y, "perturber"));
    }
}

// ===============================
// DRAW
// ===============================

function draw() {
    background(5, TRAIL_ALPHA);
    drawVignette();

    updateWave();
    updateMouseNucleus(); // Gestiona el núcleo creado por el clic

    for (let n of nuclei) {
        n.update();
        n.display();
    }

    for (let p of protectors) {
        p.applyBehaviors();
        p.update();
        p.display();
    }

    for (let p of perturbers) {
        p.applyBehaviors();
        p.update();
        p.display();
    }

    checkRingClosure();
    displayExplosionFlash();
    displayHint();
}

// ------------------------------------------------
// Crear o actualizar un Núcleo en la posición del Clic
// ------------------------------------------------

function updateMouseNucleus() {
    let overCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;

    if (mouseIsPressed && overCanvas) {
        if (!mouseNucleus) {
            mouseNucleus = new Nucleus(mouseX, mouseY);
            mouseNucleus.isMouse = true;
            nuclei.push(mouseNucleus);
        } else {
            mouseNucleus.position.set(mouseX, mouseY);
        }
    } else {
        if (mouseNucleus) {
            removeMouseNucleus();
        }
    }
}

function removeMouseNucleus() {
    if (mouseNucleus) {
        let idx = nuclei.indexOf(mouseNucleus);
        if (idx !== -1) nuclei.splice(idx, 1);
        mouseNucleus = null;
    }
}

function displayHint() {
    noStroke();
    fill(255, 255, 255, 100);
    textSize(13);
    textAlign(LEFT, BOTTOM);
    text("Mantén presionado el clic para actuar como NÚCLEO atractor", 16, height - 16);
}

function drawVignette() {
    let grad = drawingContext.createRadialGradient(
        width / 2, height / 2, height * 0.15,
        width / 2, height / 2, height * 0.75
    );
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.4)");
    drawingContext.fillStyle = grad;
    drawingContext.fillRect(0, 0, width, height);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    RELATIONS.perturber.nucleus.range = dist(0, 0, width, height) + 100;
}

function wrapDelta(fromX, fromY, toX, toY) {
    let dx = toX - fromX;
    let dy = toY - fromY;

    if (dx > width / 2) dx -= width;
    else if (dx < -width / 2) dx += width;

    if (dy > height / 2) dy -= height;
    else if (dy < -height / 2) dy += height;

    return createVector(dx, dy);
}

function nearestNucleus(x, y) {
    let best = null;
    let bestD = Infinity;

    for (let n of nuclei) {
        let d = wrapDelta(x, y, n.position.x, n.position.y).mag();
        if (d < bestD) {
            bestD = d;
            best = n;
        }
    }
    return best;
}

// ===============================
// DETECCIÓN DE CONTACTO Y EXPLOSIÓN
// ===============================

const RING_CLOSE_THRESHOLD = 0.9;
const RING_CLOSE_HOLD_FRAMES = 40;
const SHOCKWAVE_RANGE = RING_RADIUS_BASE + RING_RADIUS_VARIATION + 150;

let explosionFlashes = [];

function ringClosureFraction(target) {
    let bandMin = RING_RADIUS_BASE - RING_RADIUS_VARIATION - 25;
    let bandMax = RING_RADIUS_BASE + RING_RADIUS_VARIATION + 25;

    let angles = [];
    let associated = 0;

    for (let p of protectors) {
        if (nearestNucleus(p.position.x, p.position.y) !== target) continue;
        associated++;

        let rel = wrapDelta(target.position.x, target.position.y, p.position.x, p.position.y);
        let d = rel.mag();

        if (d > bandMin && d < bandMax) {
            angles.push(atan2(rel.y, rel.x));
        }
    }

    if (associated === 0 || angles.length < associated * 0.55) return 0;

    angles.sort((a, b) => a - b);
    let maxGap = 0;

    for (let i = 0; i < angles.length; i++) {
        let next = (i + 1 < angles.length) ? angles[i + 1] : angles[0] + TWO_PI;
        let gap = next - angles[i];
        if (gap > maxGap) maxGap = gap;
    }

    return 1 - maxGap / TWO_PI;
}

function checkRingClosure() {
    for (let i = nuclei.length - 1; i >= 0; i--) {
        let n = nuclei[i];

        // 1. Cierre de Anillo
        if (ringClosureFraction(n) > RING_CLOSE_THRESHOLD) {
            n.ringClosedFrames++;
        } else {
            n.ringClosedFrames = 0;
        }

        // 2. Partículas azules (protectors) sobre el núcleo
        let protectorOnTop = false;
        for (let p of protectors) {
            let d = wrapDelta(n.position.x, n.position.y, p.position.x, p.position.y).mag();
            if (d < (n.radius + p.radius)) {
                protectorOnTop = true;
                break;
            }
        }

        // Explota si se cierra el anillo O si una partícula azul toca el núcleo
        if (n.ringClosedFrames > RING_CLOSE_HOLD_FRAMES || protectorOnTop) {
            triggerExplosion(n);
        }
    }
}

function triggerExplosion(n) {
    let pos = createVector(n.position.x, n.position.y);
    explosionFlashes.push({ pos: pos, life: 26 });

    // Impulso expansivo a todas las partículas cercanas
    for (let p of protectors.concat(perturbers)) {
        let toParticle = wrapDelta(pos.x, pos.y, p.position.x, p.position.y);
        let d = toParticle.mag();

        if (d > SHOCKWAVE_RANGE) continue;

        let strength = map(d, 0, SHOCKWAVE_RANGE, 11, 2);
        let dir = (d < 0.01) ? p5.Vector.random2D() : toParticle.normalize();

        dir.mult(strength);
        p.velocity.add(dir);
        p.speedBoost = random(3, 5);
    }

    if (n.isMouse) {
        // Si el núcleo que explotó es el del clic, se destruye
        removeMouseNucleus();
    } else {
        // Reaparición del núcleo autónomo en el borde
        let newPos = spawnEdgePosition();
        n.position.set(newPos.x, newPos.y);
        n.velocity.mult(0);
        n.stability = 100;
        n.ringClosedFrames = 0;
    }
}

function displayExplosionFlash() {
    for (let i = explosionFlashes.length - 1; i >= 0; i--) {
        let f = explosionFlashes[i];
        let progress = 1 - f.life / 26;
        let radius = lerp(20, 320, progress);
        let alpha = lerp(220, 0, progress);

        noFill();
        strokeWeight(3);
        stroke(255, 255, 255, alpha);
        circle(f.pos.x, f.pos.y, radius);

        strokeWeight(2);
        stroke(255, 210, 170, alpha * 0.7);
        circle(f.pos.x, f.pos.y, radius * 0.6);

        f.life--;
        if (f.life <= 0) explosionFlashes.splice(i, 1);
    }
}

function updateWave() {
    if (frameCount > nextWaveChange) {
        waveSide = floor(random(4));
        nextWaveChange = frameCount + floor(random(240, 540));
    }
}

function spawnEdgePosition() {
    let side = (random() < 0.65) ? waveSide : floor(random(4));
    let x, y;

    if (side == 0) { x = random(width); y = -40; }
    else if (side == 1) { x = width + 40; y = random(height); }
    else if (side == 2) { x = random(width); y = height + 40; }
    else { x = -40; y = random(height); }

    return { x, y };
}

// ===============================
// CLASE PARTÍCULA
// ===============================

class Particle {
    constructor(x, y, type, ringR) {
        this.type = type;
        this.position = createVector(x, y);

        this.velocity = p5.Vector.random2D();
        this.velocity.mult(random(0.3, 1.2));

        this.acceleration = createVector();
        this.speedBoost = 1;

        this.forceScale = random(0.8, 1.25);
        this.sizeTrait = map(this.forceScale, 0.8, 1.25, 0.85, 1.25);

        this.noiseOffX = random(1000);
        this.noiseOffY = random(2000);

        if (type === "protector") {
            this.maxSpeed = MAX_SPEED_PROTECTOR * random(0.85, 1.2);
            this.radius = PROTECTOR_RADIUS;
            this.ringRadius = ringR;
            this.vigilance = pow(random(), 2);
        } else {
            this.maxSpeed = MAX_SPEED_PERTURBER * random(0.85, 1.15);
            this.radius = PERTURBER_RADIUS;
        }
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    applyBehaviors() {
        let total = createVector();

        if (this.type === "protector") {
            total.add(this.ringForce());
            total.add(this.repelProtectors());
            total.add(this.chasePerturbers());
            total.add(this.wander(WANDER_PROTECTOR));
        } else {
            total.add(this.approachNucleus());
            total.add(this.fleeProtectors());
            total.add(this.wander(WANDER_PERTURBER));
        }

        total.mult(this.forceScale);
        this.applyForce(total);
    }

    ringForce() {
        let rel = RELATIONS.protector.nucleus;
        let target = nearestNucleus(this.position.x, this.position.y);

        if (!target) return createVector();

        let toNucleus = wrapDelta(this.position.x, this.position.y, target.position.x, target.position.y);
        let d = toNucleus.mag();

        if (d < 0.001) return createVector();

        let dir = toNucleus.div(d);
        let offset = d - this.ringRadius;
        let mag = constrain(offset * rel.k, -rel.maxForce, rel.maxForce);

        return dir.mult(mag);
    }

    repelProtectors() {
        let rel = RELATIONS.protector.protector;
        let steering = createVector();

        for (let other of protectors) {
            if (other === this) continue;

            let diff = wrapDelta(other.position.x, other.position.y, this.position.x, this.position.y);
            let d = diff.mag();

            if (d > 0.001 && d < rel.range) {
                let strength = rel.k * (1 - d / rel.range);
                diff.normalize();
                diff.mult(strength);
                steering.add(diff);
            }
        }

        steering.limit(rel.maxForce);
        return steering;
    }

    chasePerturbers() {
        let rel = RELATIONS.protector.perturber;
        let threat = createVector();

        for (let p of perturbers) {
            let diff = wrapDelta(this.position.x, this.position.y, p.position.x, p.position.y);
            let d = diff.mag();

            if (d > 0.001 && d < rel.range) {
                let closeness = (1 - d / rel.range);
                diff.normalize();
                diff.mult(closeness);
                threat.add(diff);
            }
        }

        if (threat.magSq() < 0.0000001) return createVector();

        threat.mult(rel.k * this.vigilance);
        threat.limit(rel.maxForce);

        return threat;
    }

    fleeProtectors() {
        let rel = RELATIONS.perturber.protector;
        let steering = createVector();

        for (let p of protectors) {
            let diff = wrapDelta(p.position.x, p.position.y, this.position.x, this.position.y);
            let d = diff.mag();

            if (d > 0.001 && d < rel.range) {
                let strength = rel.k * (1 - d / rel.range);
                diff.normalize();
                diff.mult(strength);
                steering.add(diff);
            }
        }

        steering.limit(rel.maxForce);
        return steering;
    }

    approachNucleus() {
        let rel = RELATIONS.perturber.nucleus;
        let target = nearestNucleus(this.position.x, this.position.y);

        if (!target) return createVector();

        let dir = wrapDelta(this.position.x, this.position.y, target.position.x, target.position.y);
        let d = dir.mag();
        if (d < 0.001 || d > rel.range) return createVector();

        let closeness = 1 - d / rel.range;

        dir.normalize();
        dir.mult(rel.k * closeness);
        dir.limit(rel.maxForce);

        return dir;
    }

    wander(strength) {
        let angle = noise(this.noiseOffX, frameCount * 0.005) * TWO_PI * 2;
        let force = p5.Vector.fromAngle(angle);
        force.mult(strength);
        return force;
    }

    respawn() {
        let pos = spawnEdgePosition();
        this.position.set(pos.x, pos.y);
        this.velocity = p5.Vector.random2D();
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed * this.speedBoost);
        this.velocity.mult(FRICTION);

        this.speedBoost = lerp(this.speedBoost, 1, 0.05);

        this.position.add(this.velocity);
        this.acceleration.mult(0);

        this.edges();

        if (this.type === "perturber") {
            if (
                this.position.x < -80 || this.position.x > width + 80 ||
                this.position.y < -80 || this.position.y > height + 80
            ) {
                this.respawn();
            }
        }
    }

    edges() {
        if (this.type === "protector") {
            if (this.position.x < -50) this.position.x = width + 50;
            if (this.position.x > width + 50) this.position.x = -50;
            if (this.position.y < -50) this.position.y = height + 50;
            if (this.position.y > height + 50) this.position.y = -50;
        }
    }

    display() {
        let speed = this.velocity.mag();
        let stretch = constrain(speed / this.maxSpeed, 0, 1);
        let heading = this.velocity.heading();

        let r, g, b, glow;

        if (this.type === "protector") {
            r = 130; g = 210; b = 255;
            glow = "#6ec6ff";
        } else {
            r = 255; g = 70; b = 70;
            glow = "#ff4d4d";
        }

        push();
        translate(this.position.x, this.position.y);
        rotate(heading);

        let w = this.radius * 2 * this.sizeTrait * (1 + stretch * 1.4);
        let h = this.radius * 2 * this.sizeTrait * (1 - stretch * 0.15);

        drawingContext.shadowBlur = 14 + stretch * 14;
        drawingContext.shadowColor = glow;
        noStroke();

        fill(r, g, b, 55);
        ellipse(0, 0, w * 1.7, h * 1.7);

        fill(r, g, b, 220);
        ellipse(0, 0, w, h);

        pop();
        drawingContext.shadowBlur = 0;
    }
}

// ===============================
// CLASE NÚCLEO
// ===============================

class Nucleus {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector();
        this.acceleration = createVector();

        this.maxSpeed = MAX_SPEED_NUCLEUS;
        this.radius = NUCLEUS_RADIUS;

        this.stability = 100;
        this.ringClosedFrames = 0;
        this.isMouse = false;
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update() {
        if (!this.isMouse) {
            this.receivePressure();
            this.velocity.add(this.acceleration);
            this.velocity.limit(this.maxSpeed);
            this.velocity.mult(0.99);

            this.position.add(this.velocity);
            this.acceleration.mult(0);
            this.edges();
        }
    }

    edges() {
        if (this.position.x < -this.radius) this.position.x = width + this.radius;
        if (this.position.x > width + this.radius) this.position.x = -this.radius;
        if (this.position.y < -this.radius) this.position.y = height + this.radius;
        if (this.position.y > height + this.radius) this.position.y = -this.radius;
    }

    receivePressure() {
        let rel = RELATIONS.nucleus.protector;
        let pressure = createVector();
        let total = 0;

        for (let p of protectors) {
            let diff = wrapDelta(p.position.x, p.position.y, this.position.x, this.position.y);
            let d = diff.mag();

            if (d > 0.001 && d < rel.range) {
                let strength = rel.k * (1 - d / rel.range);
                diff.normalize();
                diff.mult(strength);
                pressure.add(diff);
                total++;
            }
        }

        if (total > 0) {
            pressure.limit(rel.maxForce);
            this.applyForce(pressure);
            this.stability -= total * 0.03;
        } else {
            this.stability += 0.03;
        }

        this.stability = constrain(this.stability, 0, 100);
    }

    display() {
        let x = this.position.x;
        let y = this.position.y;

        noStroke();

        fill(168, 230, 255, 14);
        circle(x, y, this.radius * 9);
        fill(168, 230, 255, 24);
        circle(x, y, this.radius * 6);
        fill(200, 235, 255, 45);
        circle(x, y, this.radius * 3.2);

        drawingContext.shadowBlur = 24;
        drawingContext.shadowColor = this.isMouse ? "#ffb74d" : "#a8e6ff";
        fill(235, 247, 255);
        circle(x, y, this.radius * 2);
        drawingContext.shadowBlur = 0;

        noFill();
        stroke(210, 235, 255, 35);
        strokeWeight(1.5);
        circle(x, y, this.radius * 3.5);
    }
}

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
| Los tipos, cantidades, matriz y parámetros están justificados desde la intención. |    25%   |    4  | tiene que haber un numero mayor de protectores para que se evidencie la contradiccion       |
| Comprendo y puedo modificar el funcionamiento técnico del sistema.                |    20%   |    4  | puedo modificar reglas, parámetros e interacciones durante el desarrollo. |
| El sistema produce variaciones con una identidad reconocible.                     |    15%   |    4  | Cada ejecución es diferente, pero siempre mantiene el mismo comportamiento general.                          |
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

## codigo

/* ===========================================================
   PROTECCIÓN VS DESTRUCCIÓN — Motor Particle Life
   p5.js (sketch.js autocontenido — usa p5.dom para los sliders,
   no requiere HTML/CSS externo. Pensado para el p5.js Web Editor
   o cualquier index.html mínimo que solo cargue p5.js + p5.dom.js)

   - Tipos: 0 = Protector (Azul), 1 = Perturbador (Rojo), 2 = Núcleo (Cian/Blanco).
   - El clic genera un Núcleo dinámico (Tipo 2).
   - Explosión al contacto directo entre Protectores (Tipo 0) y Núcleos (Tipo 2).
   - Panel lateral derecho con sliders para la velocidad máxima de cada tipo.
   =========================================================== */

// ===============================
// CONFIGURACIÓN Y TIPOS
// ===============================

const TYPES = [
    {
        name: "Protector",
        color: [130, 210, 255],
        glow: "#6ec6ff",
        radius: 5,
        maxSpeed: 3.5,
        rMax: 160,
        rRepulsion: 25
    },
    {
        name: "Perturbador",
        color: [255, 70, 70],
        glow: "#ff4d4d",
        radius: 4,
        maxSpeed: 2.2,
        rMax: 260,
        rRepulsion: 20
    },
    {
        name: "Nucleo",
        color: [235, 247, 255],
        glow: "#a8e6ff",
        radius: 18,
        maxSpeed: 1.2,
        rMax: 200,
        rRepulsion: 40
    }
];

const EXPLOSION_TOLERANCE = 0.1;
const TYPE_PROTECTOR = 0;
const TYPE_PERTURBER = 1;
const TYPE_NUCLEUS   = 2;

const NUM_PROTECTORS = 200;
const NUM_PERTURBERS = 30;
const NUM_NUCLEI     = 2;

const FRICTION = 0.91;
const FORCE_FACTOR = 0.45;
const TRAIL_ALPHA = 12;
const PANEL_WIDTH = 260;

// ===============================
// MATRIZ DE ATRACCIÓN / REPULSIÓN (Particle Life)
// Valores entre -1.0 (Repulsión) y 1.0 (Atracción)
// ===============================

const MATRIX = [
    // [Hacia Protector, Hacia Perturbador, Hacia Núcleo]
    /* Protector (0)   */ [ -0.1,   0.15,  2.4 ],
    /* Perturbador (1) */ [ -0.15,  0.0,   0.8 ],
    /* Núcleo (2)      */ [ -0.3,   0.0,   0.0 ]
];

// Velocidades base originales (referencia para escalar proporcionalmente,
// sin nunca recortar/truncar la velocidad natural del algoritmo)
const BASE_MAX_SPEED = TYPES.map(t => t.maxSpeed);

// ===============================
// VARIABLES GLOBALES
// ===============================

let particles = [];
let mouseParticle = null;
let explosionFlashes = [];

// Referencias a los sliders y sus etiquetas de valor
let speedSliders = [];
let speedValueLabels = [];

// ===============================
// SETUP
// ===============================

function setup() {
    let cnv = createCanvas(windowWidth - PANEL_WIDTH, windowHeight);
    colorMode(RGB);
    smooth();
    background(5);

    buildControlPanel();
    initUniverse();
}

function initUniverse() {
    particles = [];

    // 1. Crear Núcleos autónomos
    for (let i = 0; i < NUM_NUCLEI; i++) {
        let nx = width * (i + 1) / (NUM_NUCLEI + 1);
        let ny = height / 2 + random(-height * 0.15, height * 0.15);
        particles.push(new Particle(nx, ny, TYPE_NUCLEUS));
    }

    // 2. Crear Protectores (Azules)
    for (let i = 0; i < NUM_PROTECTORS; i++) {
        let angle = random(TWO_PI);
        let r = random(80, 150);
        let nx = width / 2 + cos(angle) * r;
        let ny = height / 2 + sin(angle) * r;
        particles.push(new Particle(nx, ny, TYPE_PROTECTOR));
    }

    // 3. Crear Perturbadores (Rojos)
    for (let i = 0; i < NUM_PERTURBERS; i++) {
        let pos = spawnEdgePosition();
        particles.push(new Particle(pos.x, pos.y, TYPE_PERTURBER));
    }
}

// ===============================
// DRAW LOOP
// ===============================

function draw() {
    background(5, TRAIL_ALPHA);
    drawVignette();

    readSpeedSliders();
    updateMouseNucleus();
    applyParticleLifeForces();
    updateAndDrawParticles();

    checkNucleusCollisions();
    displayExplosionFlashes();
    displayUI();
}

// ===============================
// ALGORITMO PARTICLE LIFE (Núcleo de Física)
// ===============================

function calculateForce(r, a, rRep, rMax) {
    if (r < rRep) {
        // Repulsión nuclear a corta distancia
        return (r / rRep) - 1.0;
    } else if (r < rMax) {
        // Fuerza definida por la matriz a media distancia
        let mid = (rMax + rRep) / 2;
        let halfW = (rMax - rRep) / 2;
        return a * (1 - abs(r - mid) / halfW);
    }
    return 0;
}

function applyParticleLifeForces() {
    for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];
        if (p1.isMouse) continue; // El núcleo del mouse sigue al cursor

        let fx = 0;
        let fy = 0;

        for (let j = 0; j < particles.length; j++) {
            if (i === j) continue;
            let p2 = particles[j];

            let dx = p2.pos.x - p1.pos.x;
            let dy = p2.pos.y - p1.pos.y;

            // Envoltura toroidal de coordenadas
            if (dx > width / 2) dx -= width;
            else if (dx < -width / 2) dx += width;
            if (dy > height / 2) dy -= height;
            else if (dy < -height / 2) dy += height;

            let r = sqrt(dx * dx + dy * dy);
            let rMax = TYPES[p1.type].rMax;

            if (r > 0 && r < rMax) {
                let attrCoeff = MATRIX[p1.type][p2.type];
                let rRep = max(TYPES[p1.type].rRepulsion, TYPES[p2.type].radius * 1.5);

                let force = calculateForce(r, attrCoeff, rRep, rMax);

                fx += (dx / r) * force;
                fy += (dy / r) * force;
            }
        }

        // Aplicar aceleración derivada de Particle Life (idéntico al original)
        p1.vel.x = (p1.vel.x + fx * FORCE_FACTOR) * FRICTION;
        p1.vel.y = (p1.vel.y + fy * FORCE_FACTOR) * FRICTION;

        // Control de velocidad por ESCALADO proporcional, no por recorte.
        // Si el slider está en su valor por defecto, speedRatio = 1 y el
        // comportamiento es exactamente igual al original (sin sliders).
        // Mover el slider acelera/frena el movimiento de ese tipo de forma
        // pareja, sin truncar ni distorsionar el patrón de cerco/repulsión.
        let speedRatio = TYPES[p1.type].maxSpeed / BASE_MAX_SPEED[p1.type];
        p1.vel.mult(speedRatio);
    }
}

// ===============================
// ACTUALIZACIÓN Y RENDERIZADO
// ===============================

function updateAndDrawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];

        if (!p.isMouse) {
            p.pos.add(p.vel);
            p.edges();
        }

        p.display();
    }
}

// ===============================
// GESTIÓN DEL CLIC COMO NÚCLEO
// ===============================

function updateMouseNucleus() {
    let overCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;

    if (mouseIsPressed && overCanvas) {
        if (!mouseParticle) {
            mouseParticle = new Particle(mouseX, mouseY, TYPE_NUCLEUS);
            mouseParticle.isMouse = true;
            particles.push(mouseParticle);
        } else {
            mouseParticle.pos.set(mouseX, mouseY);
            mouseParticle.vel.mult(0);
        }
    } else {
        removeMouseNucleus();
    }
}

function removeMouseNucleus() {
    if (mouseParticle) {
        let idx = particles.indexOf(mouseParticle);
        if (idx !== -1) particles.splice(idx, 1);
        mouseParticle = null;
    }
}

// ===============================
// DETECCIÓN DE EXPLOSIONES
// ===============================

function checkNucleusCollisions() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let n = particles[i];
        if (n.type !== TYPE_NUCLEUS) continue;

        let triggeredExplosion = false;

        for (let p of particles) {
            if (p.type !== TYPE_PROTECTOR) continue;

            let d = p5.Vector.dist(n.pos, p.pos);

            // Se aplica la variable de tolerancia aquí:
            if (d < (n.radius + p.radius) * EXPLOSION_TOLERANCE) {
                triggeredExplosion = true;
                break;
            }
        }

        if (triggeredExplosion) {
            triggerExplosion(n);
        }
    }
}

function triggerExplosion(nucleus) {
    let pos = nucleus.pos.copy();
    explosionFlashes.push({ pos: pos, life: 25 });

    let shockwaveRange = 280;

    // Onda de choque: empuja a todas las partículas circundantes
    for (let p of particles) {
        if (p === nucleus) continue;

        let dir = p5.Vector.sub(p.pos, pos);
        let d = dir.mag();

        if (d < shockwaveRange && d > 0) {
            let force = map(d, 0, shockwaveRange, 18, 2);
            dir.normalize();
            dir.mult(force);
            p.vel.add(dir);
        }
    }

    if (nucleus.isMouse) {
        removeMouseNucleus();
    } else {
        // Reaparece el núcleo en el borde
        let newPos = spawnEdgePosition();
        nucleus.pos.set(newPos.x, newPos.y);
        nucleus.vel.mult(0);
    }
}

function displayExplosionFlashes() {
    for (let i = explosionFlashes.length - 1; i >= 0; i--) {
        let f = explosionFlashes[i];
        let progress = 1 - f.life / 25;
        let radius = lerp(20, 300, progress);
        let alpha = lerp(240, 0, progress);

        noFill();
        strokeWeight(3);
        stroke(255, 255, 255, alpha);
        circle(f.pos.x, f.pos.y, radius);

        strokeWeight(1.5);
        stroke(130, 210, 255, alpha * 0.6);
        circle(f.pos.x, f.pos.y, radius * 0.6);

        f.life--;
        if (f.life <= 0) explosionFlashes.splice(i, 1);
    }
}

// ===============================
// CLASE PARTÍCULA UNIFICADA
// ===============================

class Particle {
    constructor(x, y, type) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D().mult(random(0.2, 1.0));
        this.type = type;
        this.isMouse = false;

        let t = TYPES[this.type];
        this.radius = t.radius;
    }

    display() {
        let t = TYPES[this.type];
        let speed = this.vel.mag();
        let stretch = constrain(speed / max(t.maxSpeed, 0.01), 0, 1.2);

        push();
        translate(this.pos.x, this.pos.y);

        if (this.type !== TYPE_NUCLEUS) {
            rotate(this.vel.heading());
        }

        drawingContext.shadowBlur = 12 + stretch * 10;
        drawingContext.shadowColor = this.isMouse ? "#ffb74d" : t.glow;

        noStroke();
        fill(t.color[0], t.color[1], t.color[2], 220);

        if (this.type === TYPE_NUCLEUS) {
            // Renderizado multicapa de núcleo
            fill(168, 230, 255, 20);
            circle(0, 0, this.radius * 4);
            fill(235, 247, 255, 230);
            circle(0, 0, this.radius * 2);
        } else {
            // Renderizado elíptico según velocidad
            let w = this.radius * 2 * (1 + stretch * 0.8);
            let h = this.radius * 2 * (1 - stretch * 0.2);
            ellipse(0, 0, w, h);
        }

        pop();
        drawingContext.shadowBlur = 0;
    }

    edges() {
        if (this.pos.x < -20) this.pos.x = width + 20;
        if (this.pos.x > width + 20) this.pos.x = -20;
        if (this.pos.y < -20) this.pos.y = height + 20;
        if (this.pos.y > height + 20) this.pos.y = -20;
    }
}

// ===============================
// UTILERÍAS
// ===============================

function spawnEdgePosition() {
    let side = floor(random(4));
    if (side === 0) return { x: random(width), y: -30 };
    if (side === 1) return { x: width + 30, y: random(height) };
    if (side === 2) return { x: random(width), y: height + 30 };
    return { x: -30, y: random(height) };
}

function drawVignette() {
    let grad = drawingContext.createRadialGradient(
        width / 2, height / 2, height * 0.2,
        width / 2, height / 2, height * 0.8
    );
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.5)");
    drawingContext.fillStyle = grad;
    drawingContext.fillRect(0, 0, width, height);
}

function displayUI() {
    noStroke();
    fill(255, 255, 255, 120);
    textSize(12);
    textAlign(LEFT, BOTTOM);
    text("Motor: Particle Life | Mantén el CLIC para activar el Núcleo Atractor", 16, height - 16);
}

function windowResized() {
    resizeCanvas(windowWidth - PANEL_WIDTH, windowHeight);
    repositionControlPanel();
}

// ===============================
// PANEL DE CONTROL (creado 100% con p5.dom, sin HTML externo)
// ===============================

function buildControlPanel() {
    // Fondo del panel
    let panelBg = createDiv('');
    panelBg.id('panelBg');
    panelBg.style('position', 'fixed');
    panelBg.style('top', '0');
    panelBg.style('right', '0');
    panelBg.style('width', PANEL_WIDTH + 'px');
    panelBg.style('height', '100vh');
    panelBg.style('background', 'rgba(10, 16, 22, 0.92)');
    panelBg.style('border-left', '1px solid rgba(130, 210, 255, 0.18)');
    panelBg.style('box-sizing', 'border-box');
    panelBg.style('font-family', "'Courier New', monospace");
    panelBg.style('z-index', '10');
    panelBg.style('padding', '20px');

    let title = createDiv('PROTECCIÓN <span style="color:#a8e6ff">vs</span> DESTRUCCIÓN');
    title.parent(panelBg);
    title.style('color', '#ebf7ff');
    title.style('font-size', '15px');
    title.style('font-weight', 'bold');
    title.style('margin-bottom', '22px');

    let sectionLabel = createDiv('// VELOCIDAD MÁXIMA');
    sectionLabel.parent(panelBg);
    sectionLabel.style('color', '#7d93a3');
    sectionLabel.style('font-size', '11px');
    sectionLabel.style('letter-spacing', '0.05em');
    sectionLabel.style('margin-bottom', '18px');

    const configs = [
        { type: TYPE_PROTECTOR, label: 'Protector (azul)',    color: '#6ec6ff', min: 0.2, max: 8,   step: 0.1 },
        { type: TYPE_PERTURBER, label: 'Perturbador (rojo)',  color: '#ff6b6b', min: 0.2, max: 8,   step: 0.1 },
        { type: TYPE_NUCLEUS,   label: 'Núcleo (blanco)',     color: '#ffffff', min: 0.1, max: 5,   step: 0.1 }
    ];

    configs.forEach(cfg => {
        let row = createDiv('');
        row.parent(panelBg);
        row.style('margin-bottom', '24px');

        let labelRow = createDiv('');
        labelRow.parent(row);
        labelRow.style('display', 'flex');
        labelRow.style('justify-content', 'space-between');
        labelRow.style('font-size', '12px');
        labelRow.style('color', '#cfe4ee');
        labelRow.style('margin-bottom', '6px');

        let labelText = createSpan(cfg.label);
        labelText.parent(labelRow);

        let valueText = createSpan(TYPES[cfg.type].maxSpeed.toFixed(1));
        valueText.parent(labelRow);
        valueText.style('color', cfg.color);
        speedValueLabels[cfg.type] = valueText;

        let slider = createSlider(cfg.min, cfg.max, TYPES[cfg.type].maxSpeed, cfg.step);
        slider.parent(row);
        slider.style('width', '100%');
        slider.style('accent-color', cfg.color);
        speedSliders[cfg.type] = slider;
    });

    let hint = createDiv('Mantén el CLIC sobre el lienzo para invocar un Núcleo atractor con el mouse.');
    hint.parent(panelBg);
    hint.style('color', '#7d93a3');
    hint.style('font-size', '10px');
    hint.style('line-height', '1.6');
    hint.style('margin-top', '10px');
    hint.style('padding-top', '14px');
    hint.style('border-top', '1px solid rgba(130, 210, 255, 0.18)');
}

function repositionControlPanel() {
    // El panel usa position:fixed, así que no necesita reposicionarse
    // manualmente al redimensionar la ventana; se deja el hook por si
    // se agregan elementos con posicionamiento absoluto en el futuro.
}

function readSpeedSliders() {
    for (let type = 0; type < TYPES.length; type++) {
        if (!speedSliders[type]) continue;
        let v = speedSliders[type].value();
        TYPES[type].maxSpeed = v;
        speedValueLabels[type].html(v.toFixed(1));
    }
}

## codigo 

/* ===========================================================
   PROTECCIÓN VS DESTRUCCIÓN
   Simulación generativa — rediseño de arquitectura de fuerzas
   p5.js

   PRINCIPIO DE DISEÑO:
   Nada aquí es una trayectoria. Cada partícula solo conoce:
   - su posición
   - la posición de sus vecinas cercanas
   - unos pocos rasgos individuales (aleatorios al nacer)
   Todo lo demás (el anillo, las reorganizaciones, el
   desplazamiento del núcleo) es una CONSECUENCIA de sumar
   fuerzas locales, no algo que el código decida directamente.
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

// --- Radio ideal del anillo (target de la relación Protector->Núcleo) ---
// No es el "alcance" de la relación, es la distancia de equilibrio:
// más lejos que esto, atrae; más cerca, repele.
const RING_RADIUS_BASE = 125;
const RING_RADIUS_VARIATION = 18;   // cada protector tiene su propio radio ideal

// --- Deambular (variabilidad orgánica, no aleatoriedad pura) ---
const WANDER_PROTECTOR = 0.025;
const WANDER_PERTURBER = 0.045;

// ===============================
// MATRIZ DE RELACIONES
// ===============================
// Una sola tabla: quién siente a quién, con qué tipo de relación
// (atracción / repulsión / indiferencia / resorte), con qué
// intensidad (k), hasta qué distancia (range) y con qué tope
// de fuerza (maxForce). Todas las funciones de comportamiento
// leen sus números de aquí — nada queda "suelto" en el código.
//
//                  siente hacia ->  núcleo              protector            perturbador
// protector                         resorte (anillo)    repulsión            atracción (persigue)
// perturbador                       atracción (se acerca) repulsión (huye)   indiferencia
// núcleo                            —                    repulsión (escapa)  indiferencia
//
// range: null en el resorte significa "no tiene límite de alcance,
// su propio radio ideal (ringRadius) define dónde cambia de signo".

const RELATIONS = {

    protector: {
        nucleus:   { type: "spring",       k: 0.018, range: null,                              maxForce: 0.12 },
        protector: { type: "repulsion",    k: 1.1,   range: 46,                                 maxForce: 0.16 },
        perturber: { type: "attraction",   k: 0.9,   range: 190,                                maxForce: 0.16 }
    },

    perturber: {
        nucleus:   { type: "attraction",   k: 0.03,  range: 260,                                maxForce: 0.03 },
        protector: { type: "repulsion",    k: 1.0,   range: 100,                                maxForce: 0.18 },
        perturber: { type: "indifference", k: 0,     range: 0,                                  maxForce: 0    }
    },

    nucleus: {
        protector: { type: "repulsion",    k: 0.6,   range: RING_RADIUS_BASE + RING_RADIUS_VARIATION + 40, maxForce: 0.4 },
        perturber: { type: "indifference", k: 0,     range: 0,                                  maxForce: 0    },
        nucleus:   { type: "indifference", k: 0,     range: 0,                                  maxForce: 0    }
    }

};

// ===============================
// VARIABLES GLOBALES
// ===============================

let nuclei = [];
let protectors = [];
let perturbers = [];

// Ritmo de llegada de los perturbadores: no es una trayectoria,
// es un parámetro poblacional que cambia lentamente en el tiempo.
// Cuando coincide, varios perturbadores entran por el mismo lado
// en una ventana corta -> aparece un "enjambre" -> la amenaza
// sumada (chasePerturbers) produce una salida masiva de guardianes.
let waveSide = 0;
let nextWaveChange = 0;

// ===============================
// INTERACCIÓN DEL OBSERVADOR
// ===============================
// El cursor, mientras se mantiene presionado dentro del lienzo, se
// comporta como UN PERTURBADOR MÁS: entra en la misma lista que
// revisan los protectores para sentir amenazas (RELATIONS.protector.
// perturber). No es un modo especial ni una fuerza nueva: es la
// misma regla que ya gobierna a los perturbadores autónomos,
// aplicada también a la posición del mouse.
//
// La única diferencia es su "peso": crece mientras más tiempo se
// sostiene el clic (hasta un tope), así que sostener la intervención
// es lo que provoca la escalada de sobre-reacción — el propio
// observador puede desencadenar en vivo la paradoja del sistema.
let mouseHoldFrames = 0;
let activeThreats = [];

// ===============================
// SETUP
// ===============================

function setup() {

    createCanvas(windowWidth, windowHeight);
    colorMode(RGB);
    smooth();
    background(5);

    // El alcance de "Perturbador -> Núcleo" depende del tamaño real
    // de la pantalla (se conoce recién aquí). Se fija para cubrir
    // todo el lienzo con margen: sigue siendo un alcance finito y
    // dependiente de la distancia, no una atracción infinita.
    RELATIONS.perturber.nucleus.range = dist(0, 0, width, height) + 100;

    // Dos núcleos, separados horizontalmente con algo de variación
    // vertical -> desde el primer frame se ven como dos entidades
    // distintas, no una encima de la otra.
    nuclei = [];
    for (let i = 0; i < NUM_NUCLEI; i++) {

        let nx = width * (i + 1) / (NUM_NUCLEI + 1);
        let ny = height / 2 + random(-height * 0.15, height * 0.15);

        nuclei.push(new Nucleus(nx, ny));

    }

    waveSide = floor(random(4));
    nextWaveChange = floor(random(240, 540));

    // Protectores: se reparten en partes iguales entre los núcleos
    // (no es una asignación permanente: en applyBehaviors() cada uno
    // sigue eligiendo, frame a frame, cuál núcleo tiene más cerca).
    // Nacen ya distribuidos cerca de su propio radio ideal, para que
    // el anillo sea visible desde el primer frame.
    for (let i = 0; i < NUM_PROTECTORS; i++) {

        let home = nuclei[i % nuclei.length];

        let angle = random(TWO_PI);
        let ringR = RING_RADIUS_BASE + random(-RING_RADIUS_VARIATION, RING_RADIUS_VARIATION);

        let x = home.position.x + cos(angle) * ringR;
        let y = home.position.y + sin(angle) * ringR;

        protectors.push(new Particle(x, y, "protector", ringR));

    }

    // Perturbadores: entran desde los bordes.
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
    updateCursorThreat();

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

    displayCursorThreat();
    displayHint();

}

// ------------------------------------------------
// Actualiza la lista de amenazas que sienten los protectores.
// Si el cursor está activo, se agrega como una amenaza más,
// con un peso que crece mientras más tiempo se sostiene el clic.
// ------------------------------------------------

function updateCursorThreat() {

    let overCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
    let pressed = mouseIsPressed && overCanvas;

    activeThreats = perturbers;

    if (pressed) {

        mouseHoldFrames++;

        // El peso crece con la duración sostenida del clic (satura en 2.5x).
        let weight = constrain(1 + mouseHoldFrames / 45, 1, 2.5);

        activeThreats = perturbers.concat([{
            position: createVector(mouseX, mouseY),
            weight: weight
        }]);

    } else {

        mouseHoldFrames = 0;

    }

}

// ------------------------------------------------
// Indicador visual del cursor cuando actúa como amenaza.
// Su tamaño y brillo reflejan el mismo peso que usan los
// protectores para reaccionar: lo que se ve es lo que se siente.
// ------------------------------------------------

function displayCursorThreat() {

    if (activeThreats.length === perturbers.length) return; // cursor inactivo

    let cursor = activeThreats[activeThreats.length - 1];
    let x = cursor.position.x;
    let y = cursor.position.y;

    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = "#ff7043";
    noStroke();

    fill(255, 150, 110, 70);
    circle(x, y, 26);
    fill(255, 150, 110, 210);
    circle(x, y, 13);

    drawingContext.shadowBlur = 0;

    // Anillos tipo sonar: la CANTIDAD y el radio escalan con
    // cursor.weight (el mismo número que usa chasePerturbers()).
    // Más anillos visibles = más amenaza real está sintiendo el
    // sistema en ese instante, no una decoración fija.
    let ringCount = floor(map(cursor.weight, 1, 2.5, 1, 4));

    for (let i = 0; i < ringCount; i++) {

        let phase = (frameCount * 1.5 + i * 40) % 140;
        let alpha = map(phase, 0, 140, 90, 0);

        noFill();
        strokeWeight(1.5);
        stroke(255, 140, 110, alpha);
        circle(x, y, 20 + phase);

    }

}

// ------------------------------------------------
// Pista mínima de uso, discreta, en la esquina.
// ------------------------------------------------

function displayHint() {

    noStroke();
    fill(255, 255, 255, 70);
    textSize(13);
    textAlign(LEFT, BOTTOM);
    text("mantén clic para intervenir como amenaza", 16, height - 16);

}

// ------------------------------------------------
// Viñeta de fondo: puramente decorativa (profundidad visual),
// no representa ninguna variable del sistema. Se redibuja
// completa cada frame -> no se acumula con las estelas.
// ------------------------------------------------

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

// ------------------------------------------------
// Distancia toroidal: la pantalla envuelve, así que el camino
// más corto entre dos puntos a veces cruza un borde. Sin esto,
// cuando el núcleo esté a punto de cruzar, los protectores del
// lado opuesto lo verían "lejísimos" en línea recta en vez de
// "cerquita" por el lado corto, y tirarían en la dirección
// equivocada. Toda fuerza que dependa de distancia usa esto.
// ------------------------------------------------

function wrapDelta(fromX, fromY, toX, toY) {

    let dx = toX - fromX;
    let dy = toY - fromY;

    if (dx > width / 2) dx -= width;
    else if (dx < -width / 2) dx += width;

    if (dy > height / 2) dy -= height;
    else if (dy < -height / 2) dy += height;

    return createVector(dx, dy);

}

// ------------------------------------------------
// Con más de un núcleo, cada protector/perturbador debe decidir
// dinámicamente cuál le queda más cerca -- no es una asignación
// fija al nacer, así que si un núcleo se reubica (tras explotar),
// las partículas pueden "cambiar de bando" de forma natural.
// ------------------------------------------------

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
// CIERRE DEL ANILLO -> EXPLOSIÓN -> NUEVO NÚCLEO
// ===============================
// Cada núcleo mide su propio estado (qué tan cerrado está SU
// anillo) y reacciona cuando cruza un umbral, de forma
// independiente del otro núcleo. No es una trayectoria: ningún
// individuo sabe que existe este mecanismo, solo se mide una
// propiedad colectiva emergente (cobertura angular alrededor de
// ESE núcleo) y se dispara una consecuencia física (un impulso
// con caída por distancia), no una animación con posiciones
// fijadas a mano.
//
// Es, además, la versión más literal de la contradicción: el
// momento en que la protección finalmente logra su objetivo —
// rodear por completo a un núcleo— es el mismo momento en que
// lo destruye.

const RING_CLOSE_THRESHOLD = 0.9;   // fracción de cobertura angular requerida (90%)
const RING_CLOSE_HOLD_FRAMES = 40;  // debe sostenerse ~2/3 de segundo, no ser un parpadeo
const SHOCKWAVE_RANGE = RING_RADIUS_BASE + RING_RADIUS_VARIATION + 150;

let explosionFlashes = [];

// Fracción de "anillo cerrado" alrededor de un núcleo específico:
// 1.0 = cobertura angular perfecta, 0.0 = hueco de 360°. Solo
// cuentan los protectores cuyo núcleo más cercano es ESTE núcleo,
// para que la medición no se contamine con el anillo del otro.
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

    if (associated === 0) return 0;

    // Si muy pocos de los protectores de ESTE núcleo están en la
    // banda del anillo (dispersos o persiguiendo), no cuenta como cerrado.
    if (angles.length < associated * 0.55) return 0;

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

    for (let n of nuclei) {

        if (ringClosureFraction(n) > RING_CLOSE_THRESHOLD) {
            n.ringClosedFrames++;
        } else {
            n.ringClosedFrames = 0;
        }

        if (n.ringClosedFrames > RING_CLOSE_HOLD_FRAMES) {
            triggerExplosion(n);
            n.ringClosedFrames = 0;
        }

    }

}

function triggerExplosion(n) {

    let pos = createVector(n.position.x, n.position.y);
    explosionFlashes.push({ pos: pos, life: 26 });

    // Impulso radial real de velocidad (física, no teletransporte),
    // con caída según la distancia: solo empuja a lo que estaba
    // cerca de ESTE núcleo, así el anillo del otro núcleo no se ve
    // afectado por una explosión que no le pertenece.
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

    // El núcleo reaparece por un borde, igual que un perturbador.
    let newPos = spawnEdgePosition();
    n.position.set(newPos.x, newPos.y);
    n.velocity.mult(0);
    n.stability = 100;

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

// Cada cierto tiempo (variable, ~4-9s) cambia el lado de la racha.
function updateWave() {

    if (frameCount > nextWaveChange) {
        waveSide = floor(random(4));
        nextWaveChange = frameCount + floor(random(240, 540));
    }

}

// 65% de las veces respeta la racha (llegan agrupados),
// 35% entra por un lado totalmente aleatorio (sigue habiendo
// variabilidad, no todo colapsa a un único patrón).
function spawnEdgePosition() {

    let side = (random() < 0.65) ? waveSide : floor(random(4));
    let x, y;

    if (side == 0) { x = random(width); y = -40; }
    else if (side == 1) { x = width + 40; y = random(height); }
    else if (side == 2) { x = random(width); y = height + 40; }
    else { x = -40; y = random(height); }

    return { x, y };

}

//parte 2A-1

class Particle {

    constructor(x, y, type, ringR) {

        this.type = type;
        this.position = createVector(x, y);

        this.velocity = p5.Vector.random2D();
        this.velocity.mult(random(0.3, 1.2));

        this.acceleration = createVector();

        // Multiplicador temporal de velocidad máxima. Normalmente 1
        // (sin efecto). Una explosión lo sube de golpe y decae solo,
        // volviendo a la normalidad — así el impulso de la explosión
        // no queda anulado al instante por el límite de velocidad.
        this.speedBoost = 1;

        // Rasgo individual: escala global de intensidad de sus fuerzas.
        // Es la fuente principal de variabilidad entre partículas y
        // entre ejecuciones (no afecta a UNA fuerza, afecta a todas).
        this.forceScale = random(0.8, 1.25);

        // Rasgo individual de tamaño, correlacionado a propósito con
        // forceScale (no es independiente ni azar decorativo): una
        // partícula que actúa con más intensidad también ocupa un
        // poco más de espacio visual. Es la misma variabilidad,
        // solo que ahora también se puede VER, no solo simular.
        this.sizeTrait = map(this.forceScale, 0.8, 1.25, 0.85, 1.25);

        // Deambular orgánico (ruido Perlin, no ruido puro)
        this.noiseOffX = random(1000);
        this.noiseOffY = random(2000);

        if (type === "protector") {

            this.maxSpeed = MAX_SPEED_PROTECTOR * random(0.85, 1.2);
            this.radius = PROTECTOR_RADIUS;

            // Radio ideal individual respecto al núcleo -> genera el anillo.
            this.ringRadius = ringR;

            // Vigilancia: rasgo continuo, sesgado para que la mayoría
            // reaccione poco y solo unos pocos reaccionen mucho.
            // No es un interruptor fijo: se combina con la distancia
            // real al perturbador en cada frame.
            this.vigilance = pow(random(), 2);

        } else {

            this.maxSpeed = MAX_SPEED_PERTURBER * random(0.85, 1.15);
            this.radius = PERTURBER_RADIUS;

        }

    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    // ------------------------------------------------

    applyBehaviors() {

        let total = createVector();

        if (this.type === "protector") {

            total.add(this.ringForce());
            total.add(this.repelProtectors());
            total.add(this.chasePerturbers());
            total.add(this.wander(WANDER_PROTECTOR));

        } else {

            // Relación Perturbador <-> Perturbador: INDIFERENCIA.
            // Es intencional que no exista ninguna fuerza entre ellos:
            // no se atraen, no se repelen, no se "ven" entre sí.
            // Cada perturbador solo le importa su relación con el
            // núcleo (atracción) y con los protectores (huida).

            total.add(this.approachNucleus());
            total.add(this.fleeProtectors());
            total.add(this.wander(WANDER_PERTURBER));

        }

        // El rasgo individual escala TODO el comportamiento de la partícula,
        // no una fuerza aislada: así cada una "actúa distinto" de forma coherente.
        total.mult(this.forceScale);

        this.applyForce(total);

    }

    // ------------------------------------------------
    // Resorte hacia la distancia ideal respecto al núcleo.
    // Único origen del anillo. Atrae si está lejos, repele si está cerca.
    // ------------------------------------------------

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

    // ------------------------------------------------
    // Repulsión entre protectores (misma población).
    // Caída suave dentro del rango: evita saltos bruscos de fuerza.
    // ------------------------------------------------

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

    // ------------------------------------------------
    // Reaccionar ante los perturbadores cercanos.
    // Intensidad = vigilancia individual x (suma de amenaza de TODOS
    // los perturbadores dentro de rango, no solo el más cercano).
    // Esto es lo que produce la "reacción exagerada": un solo intruso
    // genera una respuesta moderada, pero varios juntos generan una
    // respuesta desproporcionada — la sobre-reacción emerge de sumar
    // amenazas locales, no de una regla que diga "si hay muchos, reacciona más".
    // Nadie está "marcado" como guardián de por vida: reacciona quien
    // tiene el rasgo y además siente amenaza real en ese instante.
    // ------------------------------------------------

    // ------------------------------------------------
    // Reaccionar ante las amenazas cercanas (perturbadores autónomos
    // Y, si el observador lo activa, el cursor). Intensidad =
    // vigilancia individual x (suma ponderada de amenaza de TODAS
    // las fuentes dentro de rango, no solo la más cercana).
    // Esto es lo que produce la "reacción exagerada": una sola
    // amenaza genera una respuesta moderada, pero varias juntas -o
    // una sostenida por el usuario, cuyo peso crece con el tiempo-
    // generan una respuesta desproporcionada. La sobre-reacción
    // emerge de sumar amenazas locales, no de una regla que diga
    // "si hay muchas, reacciona más". Nadie está "marcado" como
    // guardián de por vida: reacciona quien tiene el rasgo y además
    // siente amenaza real en ese instante — sea del sistema o del
    // observador.
    // ------------------------------------------------

    chasePerturbers() {

        let rel = RELATIONS.protector.perturber;
        let threat = createVector();

        for (let p of activeThreats) {

            let diff = wrapDelta(this.position.x, this.position.y, p.position.x, p.position.y);
            let d = diff.mag();

            if (d > 0.001 && d < rel.range) {

                let closeness = (1 - d / rel.range) * (p.weight || 1);
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

    // ------------------------------------------------
    // Huir de los protectores cercanos.
    // ------------------------------------------------

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

    // ------------------------------------------------
    // Atracción débil y constante hacia el núcleo.
    // No busca destruir: solo acercarse. Esta es la pieza
    // que en el código original no existía.
    // Antes esta fuerza no tenía límite de alcance (atraía sin
    // importar la distancia); ahora, como todas las demás
    // relaciones, se apaga fuera de su rango.
    // ------------------------------------------------

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

    // ------------------------------------------------
    // Deambular orgánico basado en ruido Perlin individual.
    // Aporta variabilidad continua sin ser una trayectoria fija.
    // ------------------------------------------------

    wander(strength) {

        let angle = noise(this.noiseOffX, frameCount * 0.005) * TWO_PI * 2;
        let force = p5.Vector.fromAngle(angle);
        force.mult(strength);

        return force;

    }

    // ------------------------------------------------

    respawn() {

        let pos = spawnEdgePosition();
        this.position.set(pos.x, pos.y);
        this.velocity = p5.Vector.random2D();

    }

    // ------------------------------------------------

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

    // ------------------------------------------------

    edges() {

        if (this.type === "protector") {

            if (this.position.x < -50) this.position.x = width + 50;
            if (this.position.x > width + 50) this.position.x = -50;
            if (this.position.y < -50) this.position.y = height + 50;
            if (this.position.y > height + 50) this.position.y = -50;

        }

    }

    // ------------------------------------------------
    // Identidad visual por población (esto NO es la contradicción,
    // solo distingue "quién es quién" — igual en toda ejecución).
    //
    // Dos decisiones de apariencia, ambas ancladas a datos reales
    // del sistema (no a símbolos inventados):
    //
    // 1) El cuerpo se ESTIRA en la dirección de su velocidad real.
    //    Seleccioné elongar según this.velocity porque quiero hacer
    //    perceptible que la posición, velocidad y aceleración no son
    //    solo variables internas sino lo que literalmente dibuja la
    //    escena. Espero que produzca una sensación de urgencia en los
    //    guardianes que rompen filas (se ven "lanzados") y de calma
    //    en los que orbitan estables (se ven casi circulares).
    //
    // 2) El tamaño varía levemente según this.sizeTrait (rasgo
    //    individual fijado al nacer). Seleccioné esto porque quiero
    //    hacer perceptible la variabilidad entre individuos (no todos
    //    los protectores son idénticos). Espero que produzca una
    //    sensación de multitud heterogénea, no de un patrón repetido.
    // ------------------------------------------------

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

        // Halo suave (capa grande, muy transparente)
        fill(r, g, b, 55);
        ellipse(0, 0, w * 1.7, h * 1.7);

        // Cuerpo (capa pequeña, opaca)
        fill(r, g, b, 220);
        ellipse(0, 0, w, h);

        pop();
        drawingContext.shadowBlur = 0;

    }

}

// =====================================================
// NÚCLEO
// No decide nada. Solo recibe fuerzas y reacciona.
// =====================================================

class Nucleus {

    constructor(x, y) {

        this.position = createVector(x, y);
        this.velocity = createVector();
        this.acceleration = createVector();

        this.maxSpeed = MAX_SPEED_NUCLEUS;
        this.radius = NUCLEUS_RADIUS;

        // Métrica interna. No se usa para cambiar su apariencia:
        // la única evidencia visible del daño es su desplazamiento
        // y su rastro, no un color ni un símbolo.
        this.stability = 100;

        // Cuántos frames seguidos lleva SU anillo cerrado por
        // encima del umbral (ver checkRingClosure). Cada núcleo
        // lleva la cuenta de forma independiente.
        this.ringClosedFrames = 0;

    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update() {

        this.receivePressure();

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.velocity.mult(0.99);

        this.position.add(this.velocity);
        this.acceleration.mult(0);

        this.edges();

    }

    // ------------------------------------------------
    // Igual que protectores y perturbadores: si cruza un borde,
    // reaparece por el lado opuesto. El núcleo no es una excepción
    // encerrada en el lienzo, es una partícula más del sistema.
    // ------------------------------------------------

    edges() {

        if (this.position.x < -this.radius) this.position.x = width + this.radius;
        if (this.position.x > width + this.radius) this.position.x = -this.radius;
        if (this.position.y < -this.radius) this.position.y = height + this.radius;
        if (this.position.y > height + this.radius) this.position.y = -this.radius;

    }

    // ------------------------------------------------
    // La presión de los protectores termina desplazando al núcleo.
    // Caída suave con la distancia, sin corte duro.
    // ------------------------------------------------

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

    // ------------------------------------------------
    // Apariencia fija en color e intensidad — a propósito no varía
    // con this.stability. La historia del daño la cuenta el
    // movimiento y el rastro que deja, no un cambio visual directo.
    // Lo único que cambia aquí es que el render tiene más capas de
    // luz (más "vistoso"), pero ninguna capa codifica un estado.
    // ------------------------------------------------

    display() {

        let x = this.position.x;
        let y = this.position.y;

        noStroke();

        // Halo exterior amplio y suave (profundidad, no información)
        fill(168, 230, 255, 14);
        circle(x, y, this.radius * 9);
        fill(168, 230, 255, 24);
        circle(x, y, this.radius * 6);
        fill(200, 235, 255, 45);
        circle(x, y, this.radius * 3.2);

        // Cuerpo (capa opaca, con brillo)
        drawingContext.shadowBlur = 24;
        drawingContext.shadowColor = "#a8e6ff";
        fill(235, 247, 255);
        circle(x, y, this.radius * 2);
        drawingContext.shadowBlur = 0;

        // Anillo fino de contorno (referencia de escala, no un medidor)
        noFill();
        stroke(210, 235, 255, 35);
        strokeWeight(1.5);
        circle(x, y, this.radius * 3.5);

    }

}

const engine = Matter.Engine.create();
const render = Matter.Render.create({
    element: document.querySelector(".plinko-container"),
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#333'
    }
});

Matter.Engine.run(engine);
Matter.Render.run(render);

const { Bodies, Body, World, Events } = Matter;

const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
const leftWall = Bodies.rectangle(-10, 300, 60, 610, { isStatic: true });
const rightWall = Bodies.rectangle(810, 300, 60, 610, { isStatic: true });
const ceiling = Bodies.rectangle(400, -10, 810, 60, { isStatic: true });

const pinRadius = 5;
const numRows = 9;
const numCols = 9;
const xOffset = 100;
const yOffset = 100;
const xSpacing = 70;
const ySpacing = 70;
const pins = [];

for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
        if (row % 2 === 0 || col < numCols - 1) {
            const x = xOffset + col * xSpacing + (row % 2 === 0 ? xSpacing / 2 : 0);
            const y = yOffset + row * ySpacing;
            pins.push(Bodies.circle(x, y, pinRadius, { isStatic: true }));
        }
    }
}

const potWidth = 60;
const potHeight = 60;
const numPots = 8;
const potSpacing = 70;
const pots = [];

for (let i = 0; i < numPots; i++) {
    const x = xOffset + i * potSpacing + potWidth / 2;
    const y = 500 + yOffset + potHeight / 2;
    const pot = Bodies.rectangle(x, y, potWidth, potHeight, { isStatic: true, label: `pot${i}` });
    pots.push(pot);
}

World.add(engine.world, [ground, leftWall, rightWall, ceiling, ...pins, ...pots]);

let ball = null;

function spawnBall() {
    if (ball) {
        World.remove(engine.world, ball);
    }

    const ballRadius = 10;
    const randomX = xOffset + Math.random() * (numCols * xSpacing - ballRadius * 2);
    ball = Bodies.circle(randomX, 50, ballRadius, { restitution: 0.5 });

    World.add(engine.world, ball);
}

spawnBall();

Events.on(engine, "collisionStart", (event) => {
    const { pairs } = event;

    pairs.forEach(({ bodyA, bodyB }) => {
        if (bodyA === ball || bodyB === ball) {
            const pot = bodyA !== ball ? bodyA : bodyB;

            if (pot.label && pot.label.startsWith("pot")) {
                console.log("Ball entered pot:", pot.label);
                spawnBall();
            }
        }
    });
});

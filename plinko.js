const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const canvas = document.getElementById('plinkoCanvas');
const engine = Engine.create();
const world = engine.world;
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        wireframes: false,
        background: '#333'
    }
});

Engine.run(engine);
Render.run(render);

const pegRadius = 10;
const pegSpacing = 70;
const numPegRows = 10;
const numPots = 9;
const potWidth = pegSpacing;
const potHeight = 100;
const ballRadius = pegRadius;

// Create pegs
for (let row = 0; row < numPegRows; row++) {
    const isEvenRow = row % 2 === 0;
    const numPegsInRow = isEvenRow ? numPots : numPots - 1;
    const xOffset = isEvenRow ? pegSpacing / 2 : 0;

    for (let i = 0; i < numPegsInRow; i++) {
        const x = xOffset + i * pegSpacing;
        const y = pegSpacing / 2 + row * pegSpacing;
        const peg = Bodies.circle(x, y, pegRadius, {
            isStatic: true,
            render: {
                fillStyle: '#9091dd'
            }
        });
        World.add(world, peg);
    }
}

// Create pots
for (let i = 0; i < numPots; i++) {
    const x = i * potWidth + potWidth / 2;
    const y = canvas.height - potHeight / 2;
    const pot = Bodies.rectangle(x, y, potWidth, potHeight, {
        isStatic: true,
        render: {
            fillStyle: '#444'
        }
    });
    World.add(world, pot);
}

const dropBallButton = document.getElementById('dropBall');
dropBallButton.addEventListener('click', () => {
    const randomX = Math.random() * canvas.width;
    const ball = Bodies.circle(randomX, ballRadius, ballRadius, {
        restitution: 0.5,
        render: {
            fillStyle: '#fff'
        }
    });
    World.add(world, ball);
});

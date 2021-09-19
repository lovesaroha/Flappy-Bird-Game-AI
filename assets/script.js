"use-strict";

/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Themes.
const themes = [{ normal: "#5468e7", veryLight: "#eef0fd" }, { normal: "#e94c2b", veryLight: "#fdedea" }];

// Choose random color theme.
let colorTheme = themes[Math.floor(Math.random() * themes.length)];

// This function set random color theme.
function setTheme() {
    // Change css values.
    document.documentElement.style.setProperty("--primary", colorTheme.normal);
}

// Set random theme.
setTheme();

// First layer weights.
const weightsOne = lmath.ToMatrix([
    [
        -0.7013166475650984,
        1.0326027195085024,
        0.8966381287897898,
        -0.35966617967981485,
        0.9363011497849616
    ],
    [
        0.5396616168275166,
        -0.34104668183642084,
        0.6179695035312496,
        -0.813216056317388,
        0.8532461605822755
    ],
    [
        -0.3608242268867867,
        0.11340412332665632,
        -0.9603466561185265,
        0.21450692235911553,
        -0.46538548027753057
    ],
    [
        -0.26405662442382916,
        0.22297147395719488,
        -0.3556992965672511,
        -0.9094186134155235,
        0.33423014921896876
    ],
    [
        -0.7249723661053249,
        0.44457525568269596,
        0.5521890288693948,
        -0.3082398387672947,
        -0.8056741940272936
    ],
    [
        -0.7609160378768505,
        -0.9412605103078866,
        -0.7673153421902668,
        -0.8085437195352483,
        0.8449261344819043
    ],
    [
        -0.003942746864264324,
        -0.3161979527871246,
        0.3778323690582333,
        -0.5679366369076786,
        1.040852208833875
    ],
    [
        0.8471652647961834,
        0.08058390392321069,
        0.9833766019645727,
        0.7721875907854194,
        -0.8609559348747166
    ]
]);

// Bias of layer one.
const biasOne = lmath.ToMatrix([
    [
        -0.5682645561534896
    ],
    [
        -0.9869467999850965
    ],
    [
        0.07774442988618989
    ],
    [
        -0.2106645810135089
    ],
    [
        -0.8621746408804783
    ],
    [
        0.5910895032640799
    ],
    [
        -0.7758334889020846
    ],
    [
        0.8948557666279263
    ]
]);

// Second layer weights.
const weightsTwo = lmath.ToMatrix([
    [
        -0.32598540977014623,
        -0.01983449111137467,
        -0.21585239488004448,
        -0.2192737962108448,
        -0.8340066776789606,
        0.1242833111887834,
        -0.2812807647378921,
        0.5143661744470065
    ],
    [
        -0.5178308306020853,
        -0.7877748599684193,
        0.19377809339822305,
        0.1434720540269362,
        0.6472873884906121,
        -0.614320359297107,
        0.7598263515896075,
        -0.30510656074260745
    ]
]);

// Bias of layer two.
const biasTwo = lmath.ToMatrix([
    [
        0.542584657173931
    ],
    [
        0.9306705446227336
    ]
]);

// Predict function.
function predict(input) {
    input = lmath.ToMatrix(input);
    let outputOne = weightsOne.Dot(input).Add(biasOne).Map(lmath.Sigmoid);
    return weightsTwo.Dot(outputOne).Add(biasTwo).Map(lmath.Sigmoid);
}

// Get canvas info from DOM.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Obstacles defined.
let obstacles = [];

// Default variables.
let lift = -12;
let gravity = 0.8;
let gap = 200;
let speed = 6;
let obstacleGap = 500;
let score = 0;


// Bird object defined.
class Bird {
    constructor() {
        this.x = 64;
        this.y = canvas.height / 2;
        this.velocity = 0;
    }

    // Show function shows bird on canvas.
    show() {
        ctx.font = '300 46px "Font Awesome 5 Pro"';
        ctx.fillStyle = colorTheme.normal;
        ctx.textAlign = 'center';
        ctx.fillText("\uf4ba", this.x, this.y);
    }

    // Move up function moves bird up.
    moveUp() {
        this.velocity += lift;
    }

    // Update bird.
    update() {
        this.velocity += gravity;
        this.y += this.velocity;
        // Detect collision.
        if ((bird.x + 23 > obstacleOne.xPosition) && (bird.x - 23 < obstacleOne.xPosition + obstacleOne.width)) {
            if (bird.y - 23 < obstacleOne.top || bird.y + 23 > obstacleOne.bottom) {
                // Collision.
                resetGame();
            }
        }
    }
}

let bird = new Bird();

// Obstacle object.
class Obstacle {
    constructor(xGap) {
        this.top = lmath.Random(canvas.height / 6, (3 / 4) * canvas.height);
        let x = canvas.width + 100;
        if (xGap) {
            x = xGap + obstacleGap;
        }
        this.xPosition = x;
        this.bottom = this.top + gap;
        this.width = 10;
        this.cross = false;
    }

    // Show function shows it on canvas.
    show() {
        // Show top.
        ctx.beginPath();
        ctx.fillStyle = colorTheme.normal;
        ctx.fillRect(this.xPosition, 0, this.width, this.top);

        // Show bottom.
        ctx.beginPath();
        ctx.fillStyle = colorTheme.normal;
        ctx.fillRect(this.xPosition, this.bottom, this.width, canvas.height - this.bottom);
        ctx.stroke();
    }

    // Move function moves obstacle.
    move() {
        this.xPosition -= speed;
    }
}

// Obstacles defined.
let obstacleOne = new Obstacle();
let obstacleTwo = new Obstacle(obstacleOne.xPosition);

draw();

// Draw function defined.
function draw() {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.show();
    bird.update();
    if (obstacleOne.xPosition < 0 - obstacleOne.width) {
        obstacleOne = obstacleTwo;
        obstacleTwo = new Obstacle(obstacleOne.xPosition);
    }
    if (bird.x > obstacleOne.xPosition) {
        if (!obstacleOne.cross) {
            score++;
            document.getElementById("score_id").innerText = score;
        }
        obstacleOne.cross = true;
    }
    obstacleOne.move();
    obstacleOne.show();
    obstacleTwo.move();
    obstacleTwo.show();

    let inputs = [];
    inputs[0] = bird.y / canvas.height;
    inputs[1] = (obstacleOne.top + 100) / canvas.height;
    inputs[2] = obstacleOne.bottom / canvas.height;
    inputs[3] = obstacleOne.xPosition / canvas.width;
    inputs[4] = bird.velocity / 10;
    let output = predict(inputs);
    if (output.values[0][0] > output.values[1][0]) {
        bird.moveUp();
    }
    window.requestAnimationFrame(draw);
}
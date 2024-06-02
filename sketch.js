let particles;
let img;
let n, s;
let paintingComplete = false;

let navBarWidth;
let navBarOpen = false;
let hamburgerButton;
let closeNavButton;
let buttonHovered = false;

function preload() {
    img = loadImage('family.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background("#f0ead6");
    smooth();
    navBarOpen = false;

    n = 21000;
    s = 3.5;

    particles = [];
    initParticles();

    navBarWidth = width / 6;

    closeNavButton = createButton('✕');
    closeNavButton.style('background-color', '#000');
    closeNavButton.style('color', '#fff');
    closeNavButton.style('border', 'none');
    closeNavButton.style('font-size', '20px');
    closeNavButton.style('padding', '5px 10px');
    closeNavButton.style('position', 'absolute');
    closeNavButton.style('top', '10px');
    closeNavButton.style('right', '10px');
    closeNavButton.mousePressed(closeNavBar);
    closeNavButton.hide();

    closeNavButton.mouseMoved(() => {
        buttonHovered = true;
    });

    closeNavButton.mouseOut(() => {
        buttonHovered = false;
    });

    navBar = createDiv('');
    navBar.style('background-color', '#000');
    navBar.style('position', 'absolute');
    navBar.style('top', '0');
    navBar.style('left', '-' + navBarWidth + 'px');
    navBar.style('height', '100vh');
    navBar.style('width', navBarWidth + 'px');
    navBar.style('z-index', '1');

    // Section 1 - Show Text
    let showTextButton = createDiv('Show Text');
    showTextButton.class('section-menu');
    showTextButton.style('text-align', 'left'); 
    showTextButton.style('margin-top', '50px');
    showTextButton.style('font-size', '20px');
    showTextButton.mousePressed(showText);
    navBar.child(showTextButton);

    // Section 2 - Refresh
    let refreshButton = createDiv('Refresh');
    refreshButton.class('section-menu');
    refreshButton.style('text-align', 'left'); 
    refreshButton.style('margin-top', '13px');
    refreshButton.style('font-size', '20px');
    refreshButton.mousePressed(refreshPage);
    navBar.child(refreshButton);

    // Section 3 - Play Music
    let playMusicButton = createDiv('Play Music');
    playMusicButton.class('section-menu');
    playMusicButton.style('text-align', 'left'); 
    playMusicButton.style('margin-top', '13px');
    playMusicButton.style('font-size', '20px');
    playMusicButton.mousePressed(playMusic);
    navBar.child(playMusicButton);

    navBar.child(closeNavButton);

    hamburgerButton = createButton('☰');
    hamburgerButton.position(10, 10);
    hamburgerButton.style('background-color', '#000');
    hamburgerButton.style('color', '#fff');
    hamburgerButton.style('border', 'none');
    hamburgerButton.style('font-size', '20px');
    hamburgerButton.style('padding', '5px 10px');
    hamburgerButton.mousePressed(toggleNavBar);

    // Check if the navigation bar was open before refresh
    let navBarState = localStorage.getItem('navBarOpen');
    if (navBarState === 'true') {
        toggleNavBar();
    }
}

function draw() {
    noStroke();

    if (!paintingComplete) {
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.show();
            p.move();
            if (p.isDead()) particles.splice(i, 1);
        }
        if (particles.length == 0 && s <= 1) {
            paintingComplete = true;
        }
    }

    if (buttonHovered) {
        closeNavButton.style('background-color', '#ccc');
    } else {
        closeNavButton.style('background-color', '#000');
    }

    if (navBarOpen) {
        translate(navBarWidth, 0);
    }
}

function initParticles() {
    for (let i = 0; i < n; i++) {
        particles.push(new Particle(s));
        let p = particles[i];
        let x = int(map(p.pos.x, 0, width, 0, img.width));
        let y = int(map(p.pos.y, 0, height, 0, img.height));
        p.c = img.get(x, y);
    }
}

class Particle {
    constructor(s_) {
        this.s = s_;
        this.c = "";
        this.life = 250;
        this.init();
    }
    init() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector();
    }
    show() {
        fill(this.c);
        ellipse(this.pos.x, this.pos.y, this.s, this.s);
        this.life -= 1;
    }
    move() {
        let angle = noise(this.pos.x / 400, this.pos.y / 600) * TWO_PI;
        this.vel.set(cos(angle), sin(angle));
        this.vel.mult(0.3);
        this.pos.add(this.vel);
    }
    isDead() {
        return (this.life < 1);
    }
}

function toggleNavBar() {
    navBarOpen = !navBarOpen;
    if (navBarOpen) {
        hamburgerButton.hide();
        closeNavButton.show();
        closeNavButton.position(navBarWidth - 43, 10);
        navBar.style('transform', 'translateX(' + navBarWidth + 'px)');
    } else {
        hamburgerButton.show();
        closeNavButton.hide();
        navBar.style('transform', 'translateX(-' + navBarWidth + 'px)');
    }

    // Store the state of the navigation bar in localStorage
    localStorage.setItem('navBarOpen', navBarOpen);
}

function closeNavBar() {
    navBarOpen = false;
    hamburgerButton.show();
    closeNavButton.hide();
    navBar.style('transform', 'translateX(-' + navBarWidth + 'px)');

    // Store the state of the navigation bar in localStorage
    localStorage.setItem('navBarOpen', navBarOpen);
}

function showText() {
    // Create a new div element
    let textDiv = createDiv('They are God’s gift to you, As you are to them by Hillary Grace');
    textDiv.style('position', 'absolute');
    textDiv.style('top', '80%');
    textDiv.style('left', '53%');
    textDiv.style('transform', 'translate(-50%, -50%)');
    textDiv.style('background-color', 'rgba(0, 0, 0, 0.5)');
    textDiv.style('color', '#fff');
    textDiv.style('padding', '20px');
    textDiv.style('font-size', '24px');
    textDiv.style('text-align', 'center');
    textDiv.parent('sketch-holder'); // Place the div inside the sketch-holder div
}

function refreshPage() {
    // Reset the sketch to its initial state
    setup();
    // Store the state of the navigation bar in localStorage
    localStorage.setItem('navBarOpen', navBarOpen);
}

function playMusic() {
    let bgMusic = document.getElementById('bgMusic');
    if (bgMusic.paused) {
        bgMusic.play();
    } else {
        bgMusic.pause();
        bgMusic.currentTime = 0; // Reset the audio to the beginning
    }
}

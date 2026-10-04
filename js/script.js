// Particle "SYOMA" letters in the hero canvas, plus the small page helpers below.
//
// How it works: draw "SYOMA" once in Courier New, read the pixels back with getImageData,
// and turn every opaque pixel into a particle at 15x scale. Each frame, particles near the
// pointer get pushed away, the rest ease back home, and nearby pairs are joined by lines
// whose opacity fades with distance.
//
// This file must load after <canvas id="SYOMcanvas"> (see index.html) because it grabs
// the canvas immediately.

const canvas = document.getElementById("SYOMcanvas");
const ctx = canvas.getContext("2d");

// Global scale knobs. Both are 1 and every number below is tuned for that.
const resize_var = 1;  // particle size, pointer radius, line distance and line width
const resolution = 1;  // size of the sampled text before it is scaled up

// Where the text is drawn and sampled on the canvas (before the 15x scale-up).
const textX = 15;
const textY = 15;

// Fixed internal bitmap. CSS (css/node_letters.css) scales it to fit the page, so these
// numbers set the hero's aspect ratio and vertical spacing, not its on-screen size.
canvas.width = 2090;
canvas.height = 1000;

let particlesArray = [];

// Pointer position in canvas-bitmap coordinates; null until the first move.
const mouse = {
    x: null,
    y: null,
    radius: 250 * resize_var
};

// Shared handler for mouse and touch. Converts viewport coordinates to bitmap coordinates.
function handleMouseOrTouchMove(e) {
    const rect = canvas.getBoundingClientRect();
    const widthScale = canvas.width / rect.width;
    const heightScale = canvas.height / rect.height;

    let x, y;
    if (e.type === "mousemove") {
        x = e.clientX;
        y = e.clientY;
    } else if (e.type === "touchmove") {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    }

    mouse.x = (x - rect.left) * widthScale;
    mouse.y = (y - rect.top) * heightScale;
}

// Window touch listeners are passive by default, so this never blocks page scrolling.
// Do not register it with {passive: false}: that would break scrolling on phones.
window.addEventListener("mousemove", handleMouseOrTouchMove);
window.addEventListener("touchmove", handleMouseOrTouchMove);

// Draw the text once and sample it. The 150px-wide window fits "SYOMA" in Courier New
// exactly; a wider fallback font would clip the "A".
ctx.fillStyle = 'white';
ctx.font = `${45 * resolution}px Courier New`;
ctx.fillText('SYOMA', textX, 30 * resolution + textY);

const textCoords = ctx.getImageData(textX, textY - 15, 150 * resolution, 45 + 30);


class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3 * resize_var;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30 + 1);  // how strongly this particle reacts
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = mouse.radius;

        if (mouse.x !== null && distance < maxDistance) {
            // Repel: the closer the pointer, the stronger the push.
            const force = (maxDistance - distance) / maxDistance;
            this.x -= (dx / distance) * force * this.density;
            this.y -= (dy / distance) * force * this.density;
        } else {
            // Ease back to the home position, 10% of the remaining gap per frame.
            if (this.x !== this.baseX) {
                this.x -= (this.x - this.baseX) / 10;
            }
            if (this.y !== this.baseY) {
                this.y -= (this.y - this.baseY) / 10;
            }
        }
    }
}


// One particle per opaque pixel of the sampled text, scaled up 15x.
function init() {
    particlesArray = [];
    for (let y = 0; y < textCoords.height; y++) {
        for (let x = 0; x < textCoords.width; x++) {
            if (textCoords.data[(y * 4 * textCoords.width) + (x * 4) + 3] > 128) {
                particlesArray.push(new Particle(x * 15 / resolution * resize_var, y * 15 / resolution * resize_var));
            }
        }
    }
}
init();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();

// Join every pair of particles closer than lineDist. This is O(n^2) per frame with about
// 1000 particles, so keep the inner loop cheap. Pairs are drawn in ascending (a, b) order;
// changing the order changes the pixels slightly because the strokes are translucent.
function connect() {
    const lineDist = 100 * resize_var;
    const lineDistSq = lineDist * lineDist;
    ctx.lineWidth = 2 * resize_var;

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distSq = dx * dx + dy * dy;
            if (distSq < lineDistSq) {
                const opacityValue = 1 - (Math.sqrt(distSq) / lineDist);
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}


// Random Wikipedia article ("More" section, index.html). Called from an inline onclick,
// so it must stay a global function. Opens in the same tab.
function redirectToRandomLink() {
    const urls = [
        'https://en.wikipedia.org/wiki/Polyphasic_sleep',
        'https://en.wikipedia.org/wiki/LineageOS',
        'https://en.wikipedia.org/wiki/National_Popular_Vote_Interstate_Compact',
        'https://en.wikipedia.org/wiki/Spontaneous_generation',
        'https://en.wikipedia.org/wiki/Christopher_Thomas_Knight',
        'https://en.wikipedia.org/wiki/Laser_Kiwi_flag',
        'https://en.wikipedia.org/wiki/Flag_of_Minnesota',
        'https://en.wikipedia.org/wiki/Orange_Justice',
        'https://en.wikipedia.org/wiki/Japanese_spider_crab',
        'https://en.wikipedia.org/wiki/Ulster_County_%22I_Voted%22_sticker',
        'https://en.wikipedia.org/wiki/Trump%E2%80%93Raffensperger_phone_call',
        'https://en.wikipedia.org/wiki/Akku_Yadav',
        'https://en.wikipedia.org/wiki/Slave_George',
        'https://en.wikipedia.org/wiki/Andy_(goose)',
        'https://en.wikipedia.org/wiki/Hitoshi_Imamura',
        'https://en.wikipedia.org/wiki/Nim_Chimpsky',
        'https://en.wikipedia.org/wiki/1999_Russian_apartment_bombings',
        'https://en.wikipedia.org/wiki/Decree_770',
        'https://en.wikipedia.org/wiki/Religious_and_philosophical_views_of_Albert_Einstein',
        'https://en.wikipedia.org/wiki/Pink_certificate',
        'https://en.wikipedia.org/wiki/German_tank_problem',
        'https://en.wikipedia.org/wiki/Anti-BDS_laws',
        'https://en.wikipedia.org/wiki/Tham_Luang_cave_rescue',
        'https://en.wikipedia.org/wiki/Tunnel_boring_machine',
        'https://en.wikipedia.org/wiki/Fukuppy',
        'https://en.wikipedia.org/wiki/Mango_cult',
        'https://en.wikipedia.org/wiki/Siege_of_Beirut',
        'https://en.wikipedia.org/wiki/Ranked-choice_voting_in_the_United_States#Bans_on_use',
        'https://en.wikipedia.org/wiki/Potato_paradox',
        'https://en.wikipedia.org/wiki/Long-term_nuclear_waste_warning_messages',
        'https://en.wikipedia.org/wiki/Flying_Machines_Which_Do_Not_Fly',
        'https://en.wikipedia.org/wiki/28th_Virginia_battle_flag',
        'https://en.wikipedia.org/wiki/Snake_Island_campaign',
        'https://en.wikipedia.org/wiki/Munich_massacre',
        'https://en.wikipedia.org/wiki/Gary_Brooks_Faulkner'
    ];

    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    window.location.href = randomUrl;
}


// Mobile menu: close the off-canvas nav after tapping one of its in-page links.
// UIkit's offcanvas only auto-closes on clicks that weren't preventDefault()-ed, and
// uk-scroll always calls preventDefault(), so without this the menu stays open.
UIkit.util.on(document, 'click', '#offcanvas-nav a[uk-scroll]', () => {
    UIkit.offcanvas('#offcanvas-nav').hide();
});

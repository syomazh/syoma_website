const canvas = document.getElementById("SYOMcanvas");
const ctx = canvas.getContext("2d");


let resize_var =  1

let resultion = 1

let compX = 15
let compY = 15
let centerer = 10


canvas.width = 2090;
console.log(window.innerWidth)
// 2090
canvas.height = 1000;
console.log(window.innerHeight)
//1000
let particlesArray = [];



//mouse stuff
const mouse = {
    x: null,
    y: null,
    radius: 250 * resize_var
}

window.addEventListener("mousemove", function(e){

    //mouse is literal cancer to handle when canvas element is resized 

    var rect = canvas.getBoundingClientRect();
    var widthScale = canvas.width / rect.width;
    var heightScale = canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left)*widthScale;
    mouse.y =  (e.clientY - rect.top)*heightScale;
});



ctx.fillStyle = 'white'
ctx.font = `${45 * resultion}px Courier`;
ctx.fillText('SYOMA',compX,30*resultion+compY)


const textCoords  = ctx.getImageData(compX, -15+compY , 150*resultion,45+30)


class Particle {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = 3*resize_var;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random()* 30 +1)
    }

    draw(){
        ctx.fillStyle = 'white';
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0 , Math.PI *2 );
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y
        let distance = Math.sqrt(dx*dx + dy*dy);

        let forceX = dx/distance
        let forceY= dy/distance

        let maxDistance = mouse.radius;
        let force = (maxDistance-distance) / maxDistance;

        let dirX = forceX * force *this.density
        
        let dirY = forceY * force *this.density
        if (distance < maxDistance) {
            this.x -= dirX ;
            this.y -= dirY;
        } else {
        //coming back code, delete if want to not come back to original position   
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
    }
}


function init(){
    particlesArray = [];
    for (let y = 0; y < textCoords.height; y++){
        for (let x = 0; x < textCoords.width; x++){
            if (textCoords.data[(y*4*textCoords.width) + (x*4) + 3] > 128){
                // can put adjusters here if needed
                let positionX = x;
                let positionY = y;
                particlesArray.push(new Particle(positionX*15/resultion*resize_var, positionY*15/resultion*resize_var));
                //not a a fan of times 15 
            }
        }
    }

}
init();

function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++){
        particlesArray[i].draw();
        particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate)
}

animate();

function connect(){
    let lineDist = 100*resize_var

    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++){
        for (let b = a; b < particlesArray.length; b++){
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < lineDist){
                opacityValue = 1 - (distance/lineDist);
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                ctx.lineWidth = 2*resize_var;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}



// wikipedia random links

function redirectToRandomLink() {
    var urls = [
        'https://en.m.wikipedia.org/wiki/Polyphasic_sleep',
        'https://en.m.wikipedia.org/wiki/LineageOS',
        'https://en.m.wikipedia.org/wiki/National_Popular_Vote_Interstate_Compact',
        'https://en.m.wikipedia.org/wiki/Spontaneous_generation',
        'https://en.m.wikipedia.org/wiki/Christopher_Thomas_Knight',
        'https://en.m.wikipedia.org/wiki/Laser_Kiwi_flag',
        'https://en.m.wikipedia.org/wiki/Flag_of_Minnesota',
        'https://en.m.wikipedia.org/wiki/Orange_Justice',
        'https://en.m.wikipedia.org/wiki/Japanese_spider_crab',
        'https://en.m.wikipedia.org/wiki/Ulster_County_%22I_Voted%22_sticker',
        'https://en.m.wikipedia.org/wiki/Trump%E2%80%93Raffensperger_phone_call',
        'https://en.m.wikipedia.org/wiki/Akku_Yadav',
        'https://en.m.wikipedia.org/wiki/Slave_George',
        'https://en.m.wikipedia.org/wiki/Andy_(goose)',
        'https://en.m.wikipedia.org/wiki/Hitoshi_Imamura',
        'https://en.m.wikipedia.org/wiki/Nim_Chimpsky',
        'https://en.m.wikipedia.org/wiki/1999_Russian_apartment_bombings',
        'https://en.m.wikipedia.org/wiki/Decree_770',
        'https://en.m.wikipedia.org/wiki/Religious_and_philosophical_views_of_Albert_Einstein',
        'https://en.m.wikipedia.org/wiki/Pink_certificate',
        'https://en.m.wikipedia.org/wiki/German_tank_problem',
        'https://en.m.wikipedia.org/wiki/Anti-BDS_laws',
        'https://en.m.wikipedia.org/wiki/Tham_Luang_cave_rescue',
        'https://en.m.wikipedia.org/wiki/Tunnel_boring_machine',
        'https://en.m.wikipedia.org/wiki/Fukuppy',
        'https://en.wikipedia.org/wiki/Mango_cult',
        'https://en.wikipedia.org/wiki/Siege_of_Beirut',
        'https://en.m.wikipedia.org/wiki/Ranked-choice_voting_in_the_United_States#Bans',
        'https://en.wikipedia.org/wiki/Potato_paradox',
        'https://en.wikipedia.org/wiki/Long-term_nuclear_waste_warning_messages',
        'https://en.wikipedia.org/wiki/Flying_Machines_Which_Do_Not_Fly',
        'https://en.wikipedia.org/wiki/28th_Virginia_battle_flag',
        'https://en.wikipedia.org/wiki/Snake_Island_campaign',
        'https://en.wikipedia.org/wiki/Munich_massacre',
        'https://en.wikipedia.org/wiki/Gary_Brooks_Faulkner'
    ];

    // Select a random URL from the list
    var randomIndex = Math.floor(Math.random() * urls.length);
    var randomUrl = urls[randomIndex];

    // Redirect to the selected URL
    window.location.href = randomUrl;
}

//defining canvas width and height

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height =  innerHeight

const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn')
const container = document.querySelector('#container')
const bigScoreEl = document.querySelector('#bigScoreEl')
// const imagePlayer;

// function imageSelector (){
//     const boyImage = document.getElementById("btnBoy")
//     const girlImage = document.getElementById("btnGirl")
//     if (boyImage === 'boy'){
//         imagePlayer = "./ironvirus/Boy_Mask.png"
//         console.log(imagePlayer)
//     }else if(girlImage === 'girl'){
//             imagePlayer = "./ironvirus/Girl_Mask.png"
//             console.log(imagePlayer)
//         }
// }


//end of defining canvas width and height

//Creating a Player

class Player {
    constructor (x, y, radius, color, width, height) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.width = 200
        this.height = 200
        this.image = new Image()
        this.image.src = "./ironvirus/Boy_Mask.png"
    }

    collition(enemy){
        return(
            this.x < enemy.x + enemy.width &&
            this.x + this.width > enemy.x  &&
            this.y < enemy.y + enemy.height &&
            this.y + this.height > enemy.y 
        )
    }
    draw() {//this function produces a circle
        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        // ctx.fillStyle = this.color
        // ctx.fill()  
        ctx.drawImage(this.image, this.x, this.y, 200, 200)  
    }
}

//Creating projectiles

class Projectile {
    constructor (x, y, radius, color, speed) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.speed = speed
        this.width = 50
        this.height = 50
        this.image = new Image ()
        this.image.src = "./ironvirus/Soap1.png"
    }

    collition(enemy){
        return(
            this.x < enemy.x + enemy.width &&
            this.x + this.width > enemy.x  &&
            this.y < enemy.y + enemy.height &&
            this.y + this.height > enemy.y 
        )
    }

    draw() {//this function produces a circle
        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        // ctx.fillStyle = this.color
        // ctx.fill()  
        ctx.drawImage(this.image, this.x, this.y, 50, 50)
    }

    update() {
        this.draw()
        this.x = this.x + this.speed.x
        this.y = this.y + this.speed.y
    }

}

class Enemy {
    constructor (x, y, radius, color, speed, width, height) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.speed = speed
        this.width = 100
        this.height = 100
        this.image = new Image ()
        this.image.src = "./ironvirus/MadVirus.png"

    }
    draw() {//this function produces a circle
        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        // ctx.fillStyle = this.color
        // ctx.fill()  
        ctx.drawImage(this.image, this.x, this.y, 100, 100)
    }

    update() {
        this.draw()
        this.x = this.x + this.speed.x
        this.y = this.y + this.speed.y
    }

}

//Placing the player in the middle of the screen
let x = (canvas.width - 150)  / 2 
let y = (canvas.height - 150) / 2

let player = new Player(x, y, 30, 'blue')
let projectiles = [] //multiple projectiles will be stored in this array
let enemies = []

function init() {
    player = new Player(x, y, 30, 'blue')
    projectiles = [] 
    enemies = []
    score = 0
    scoreEl.innerHTML = score
    bigScoreEl.innerHTML = score
   
}

function spawnEnemies() {
    setInterval (() => {
        const radius = Math.random() * (30 - 10) + 10 // randomizing sizes of enemies and making sure the enemis are not too small, biggest is 30 and smallest is 10

        let x 
        let y
        if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius //set the x value- 
        y = Math.random() * canvas.height
        // y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    } else {
        x = Math.random() * canvas.width 
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius

    }
        const color = 'green'
        const angle = Math.atan2(canvas.height / 2 - y, 
            canvas.width /2 - x)
        const speed = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y , radius, color, speed))
        console.log(enemies)
    }, 1000)
}
let animationId
let score = 0
function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(255,255,255, 0.1)' //changes the opacity
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    player.draw()
    projectiles.forEach((projectile, index) => {
        projectile.update()
//removing the projectiles when they collide with the edges of the screen
        if (projectile.x + projectile.radius < 0 || 
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y -projectile.radius > canvas.height ) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }
    })

    enemies.forEach((enemy, index) => {
        enemy.update()

        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y)

//End Game
        // if (distance - enemy.radius - player.radius < 1) {
            if (player.collition(enemy)){
            // if (distance - enemy.width && enemy.height - player.width && player.height < 1){
            cancelAnimationFrame(animationId)
            container.style.display = 'flex'
            bigScoreEl.innerHTML = score
        }

//Detect collision on enemy / projectile hit
        projectiles.forEach((projectile, projectileIndex) => {
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y) //Hypot is the distance between two points

//when projectiles touch enemy
            // if (distance - enemy.radius - projectile.radius < 1) {
                if (projectile.collition(enemy)){
    //Increase score
            score += 100
            scoreEl.innerHTML = score
            console.log(score)
    
                if(enemy.radius > 10) {
                    enemy.radius -= 10
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)               
                } else {
                setTimeout(() => {
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
                }, 0)               
            }
          }
        })
    })
}

addEventListener('click', (event) => 
{
    const angle = Math.atan2(event.clientY -canvas.height / 2, event.clientX - canvas.width /2)
    
    const speed = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(
        new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', speed,)
        )
})

startGameBtn.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    container.style.display = 'none'
})


/* Trigonometry for projectiles: determine x and y speed ; 
1) get the angle 
2) get the angle using atan2() angle in radians 
3) get the x and y velocities sin(angle) cos(angle)
*/

//Replacing shapes by  actual characters
// class Enemy {
//     constructor (x, y, radius, color, speed) {
//         this.x = x
//         this.y = y
//         this.radius = radius
//         this.color = color
//         this.speed = speed
//         this.image = new Image()
//         this.image.src= "./ironvirus/iron-virus-06.png"
//     }

//     draw() {//this function produces a circle
//         //ctx.beginPath()
//         // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
//         // ctx.fillStyle = this.color
//         // ctx.fill()  
//         ctx.drawImage(this.image, this.x, this.y, 100, 100)
//     }
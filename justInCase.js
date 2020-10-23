//defining canvas width and height

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height =  innerHeight

//end of defining canvas width and height

//Creating a Player

class Player {
    constructor (x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }
    draw() {//this function produces a circle
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()    
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
    }
    draw() {//this function produces a circle
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()  
    }

    update() {
        this.draw()
        this.x = this.x + this.speed.x
        this.y = this.y + this.speed.y
    }

}

class Enemy {
    constructor (x, y, radius, color, speed) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.speed = speed
    }
    draw() {//this function produces a circle
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()  
    }

    update() {
        this.draw()
        this.x = this.x + this.speed.x
        this.y = this.y + this.speed.y
    }

}

//Placing the player in the middle of the screen
const x = canvas.width / 2
const y = canvas.height / 2

const player = new Player(x, y, 30, 'blue')
const projectiles = [] //multiple projectiles will be stored in this array
const enemies = []

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
function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
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
        if (distance - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)

        }

//Detect collision on enemy / projectile hit
        projectiles.forEach((projectile) => {
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y) //Hypot is the distance between two points
//objects touch
            if (distance - enemy.radius - projectile.radius < 1) {
                setTimeout(() => {
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
                }, 0)
                
            }
        })
    })
}

addEventListener('click', (event) => 
{
    const angle = Math.atan2(event.clientY -canvas.height / 2, event.clientX - canvas.width /2)
    
    const speed = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    projectiles.push(
        new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', speed,)
        )
})

animate()
spawnEnemies()

/* Trigonometry for projectiles: determine x and y speed ; 
1) get the angle 
2) get the angle using atan2() angle in radians 
3) get the x and y velocities sin(angle) cos(angle)
*/
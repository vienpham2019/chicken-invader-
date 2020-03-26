const container = document.querySelector(".game")
// const score = document.querySelector("p#score")
// const health_container = document.querySelector("p#health_container")
let score , health_container
const stargame_container = document.querySelector("#startgame")

let score_num = 0

const KEY_CODE_LEFT = 65 // A
const KEY_CODE_RIGHT = 68 // D

const GAME_WIDTH = window.innerWidth 
const GAME_HEIGHT = window.innerHeight

const PLAYER_MAX_SPEED = 15
const laserSpeed = 10

let AMOUNT_ALIEN = 5
const ALIEN_LASER_SPEED = 40

let endgame = false
let health_amount = 100

let player_width
let laserCooldown = laserSpeed
let space_ship_src = "https://i.pinimg.com/originals/3b/03/94/3b0394153492f7a2e31e80bb9e4c4fb5.gif"

const GAME_STATE = {
    leftPress: false,
    rightPress: false,
    mousePress: false,
    playerX: 0,
    playerY: 0,
    lasers: [],
    enemies: [],
    enemies_lasers: []
}

function setPosition(element,x,y) {
    element.style.left = `${x}px`
    element.style.top = `${y}px`
}

function createPlayer() {
    let player = document.createElement("img")
    player.src = space_ship_src
    player.id = "space_ship"
    container.append(player)
    player_width = player.width
    GAME_STATE.playerX = GAME_WIDTH / 2 - (player_width / 2)
    GAME_STATE.playerY = GAME_HEIGHT - player_width
    setPosition(player,GAME_WIDTH.playerX,GAME_STATE.playerY)
}

function createAlien(x,y) {

    let alien = document.createElement("img")

    alien.src = "https://i.imgur.com/1WdeB21.gif"
    alien.className = "alien_ship"

    setPosition(alien,x,y)
    container.append(alien)
    GAME_STATE.enemies.push({alien ,x ,y , alien_heath: 2, dx: 5 , dy: 2, laser_cooldown: ALIEN_LASER_SPEED})
}

function create_alien_by_amount() {
    const y = parseInt(Math.random() * 50) + 10
    const x = parseInt(Math.random() * (GAME_WIDTH - 100)) 
    createAlien(x,y)
}

function updatePlayer() {
    let player = document.querySelector("#space_ship")
    if(GAME_STATE.leftPress && GAME_STATE.playerX > 0){
        GAME_STATE.playerX -= PLAYER_MAX_SPEED
        player.style.transform = "skewY(-5deg)"
    }else if(GAME_STATE.rightPress && GAME_STATE.playerX < (GAME_WIDTH - player_width)){
        GAME_STATE.playerX += PLAYER_MAX_SPEED
        player.style.transform = "skewY(5deg)"
    }else{
        player.style.transform = "skewY(0deg)"
    }
    setPosition(player,GAME_STATE.playerX,GAME_STATE.playerY)

}

function createLaser(x , y) {
    x = x + (player_width / 2)
    let laser = document.createElement("img")
    laser.src = "images/laserBlue16.png"
    laser.className = "laser"
    container.append(laser)
    setPosition(laser,x,y)
    GAME_STATE.lasers.push({laser , x , y})
    let song = new Audio("songs/laser_song.mp3")
    song.volume = "0.05"
    song.play()
}

function updateLasers() {
    const lasers = GAME_STATE.lasers
    for(let i = 0; i < lasers.length; i++){
        let laser = lasers[i]
        laser.y -= 20
        if(laser.y < 400){
            checkPosition(laser)
        }
        if(laser.y > 0){
            setPosition(laser.laser,laser.x,laser.y)
        }else{
            laser.laser.remove()
            lasers.splice(lasers.indexOf(laser),1)
        }
    }
}

function createAlienLaser(x,y) {
    x = x + (player_width / 2)
    let laser = document.createElement("img")
    laser.src = "images/laserRed01.png"
    laser.className = "laser"
    container.append(laser)
    setPosition(laser,x,y)
    GAME_STATE.enemies_lasers.push({laser , x , y})
    let song = new Audio("songs/alien_laser.mp3")
    song.volume = "0.02"
    song.play()
}

function updateAlienLasers() {
    const lasers = GAME_STATE.enemies_lasers
    for(let i = 0; i < lasers.length; i++){
        let laser = lasers[i]
        laser.y += 20
        if(laser.y < (GAME_WIDTH - player_width)){
            checkPositionForAlien(laser)
        }
        if(laser.y < GAME_WIDTH){
            setPosition(laser.laser,laser.x,laser.y)
        }else{
            laser.laser.remove()
            lasers.splice(lasers.indexOf(laser),1)
        }
    }
}

function checkPosition(element) { 
    let enemies = GAME_STATE.enemies
    for (let i = 0; i < enemies.length; i++) {
        let alien = GAME_STATE.enemies[i]
        let x1 = alien.x 
        let x2 = alien.x + 100 
        if(x1 < element.x && x2 > element.x && element.y <= (alien.y + 80)){
            alien.alien_heath -= 1
            if(alien.alien_heath == 0){
                alien.alien.src = "https://media1.giphy.com/media/6mGPx9QGBTyUg/source.gif"
                let song = new Audio("songs/explosion.mp3")
                song.volume = "0.2"
                song.play()
                setTimeout(() => {
                    alien.alien.remove()
                    enemies.splice(enemies.indexOf(alien),1)
                },800)
                create_alien_by_amount()
                score_num += 1
                score.textContent = `Score: ${score_num}`
            }
            element.laser.remove()
            GAME_STATE.lasers.splice(GAME_STATE.lasers.indexOf(element),1)
        }
    }
}

function checkPositionForAlien(laser){
    let health = document.getElementById("health")

    let x1 = GAME_STATE.playerX
    let x2 = GAME_STATE.playerX + (player_width / 2)
    let y = GAME_HEIGHT - 100

    if(x1 <= laser.x && x2 >= laser.x && laser.x < y){
        health.value -= 5; 
        laser.laser.remove()
        GAME_STATE.enemies_lasers.splice(GAME_STATE.enemies_lasers.indexOf(laser),1)
    }
    if(health.value === 0){
        make_game(score_num)
        container.innerHTML = ""
        stargame_container.style.display = "flex"
        container.append(stargame_container)
    }
}

function update() {
    updatePlayer()
    updateLasers()   
    if(GAME_STATE.mousePress && laserCooldown <= 0){
        createLaser(GAME_STATE.playerX,GAME_STATE.playerY)
        laserCooldown = laserSpeed
    }

    laserCooldown -= 1

    for(let alien_obj of GAME_STATE.enemies){
        if((alien_obj.x + 100) > GAME_WIDTH || (alien_obj.x) < 0){
            alien_obj.dx = -alien_obj.dx
            alien_obj.dy = (Math.random() * 3) + 1
            if((alien_obj.x + 100) > GAME_WIDTH){
                alien_obj.alien.style.transform = "skewY(-5deg)" 
            }
            if((alien_obj.x) < 0){
                alien_obj.alien.style.transform = "skewY(5deg)" 
            }
        }
        if((alien_obj.y + 100) > 400 || (alien_obj.y) < 0){
            alien_obj.dy = -alien_obj.dy
        }
        let x = alien_obj.x += alien_obj.dx 
        let y = alien_obj.y += alien_obj.dy
        if(alien_obj.laser_cooldown === 0){
            createAlienLaser(x,(y + 50))
            alien_obj.laser_cooldown = ALIEN_LASER_SPEED
        }
        alien_obj.laser_cooldown -= 1
        updateAlienLasers()
        setPosition(alien_obj.alien,x,y)
    }
    window.requestAnimationFrame(update)
}

function onKeyDown(e) {
    if(e.keyCode === KEY_CODE_LEFT){
        GAME_STATE.leftPress = true
    }else if(e.keyCode === KEY_CODE_RIGHT){
        GAME_STATE.rightPress = true
    }
}
function onKeyUp(e) {
    if(e.keyCode === KEY_CODE_LEFT){
        GAME_STATE.leftPress = false
    }else if(e.keyCode === KEY_CODE_RIGHT){
        GAME_STATE.rightPress = false
    }
}


function init() {
    score = document.createElement("p")
    score.id = "score"
    health_container = document.createElement("p")
    health_container.id = ""
    stargame_container.style.display = "none"
    score_num = 0
    createPlayer(container)
    score.innerText = `Score: ${score_num}`
    health_container.innerHTML = "Health: <progress id='health' value='100' max='100'></progress>"
    container.append(score,health_container)
    for(let i = 1; i <= AMOUNT_ALIEN ; i ++){
        create_alien_by_amount()
    }
    window.addEventListener("keydown",onKeyDown)
    window.addEventListener("keyup",onKeyUp)
    window.addEventListener("mousedown",()=> {
        GAME_STATE.mousePress = true 
    })
    window.addEventListener("mouseup",()=> {
        GAME_STATE.mousePress = false
    })
    window.requestAnimationFrame(update)
}

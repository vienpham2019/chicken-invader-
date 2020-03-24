const container = document.querySelector(".game")

const KEY_CODE_LEFT = 65 // A
const KEY_CODE_RIGHT = 68 // D

const GAME_WIDTH = window.innerWidth 
const GAME_HEIGHT = window.innerHeight

const PLAYER_MAX_SPEED = 15
const lazerSpeed = 6

const ENEMIES_PER_ROW = 10
const ENEMY_HORIZONTAL_PADDING = 80
const ENEMY_VERTICAL_PADDING = 70
const ENEMY_VERTICAL_SPACING = 80

let player_width
let lazerCooldown = lazerSpeed

const GAME_STATE = {
    leftPress: false,
    rightPress: false,
    mousePress: false,
    playerX: 0,
    playerY: 0,
    lazers: [],
    enemies: [],
}

function setPosition(element,x,y) {
    element.style.left = `${x}px`
    element.style.top = `${y}px`
}

function createPlayer() {
    let player = document.createElement("img")
    player.src = "images/pngguru.com.png"
    player.id = "space_ship"
    container.append(player)
    player_width = player.width
    GAME_STATE.playerX = GAME_WIDTH / 2 - (player_width / 2)
    GAME_STATE.playerY = GAME_HEIGHT - player_width
    setPosition(player,GAME_WIDTH.playerX,GAME_STATE.playerY)
}

function createAlien(x,y) {

    let alien = document.createElement("img")

    alien.src = "images/alien.png"
    alien.className = "alien_ship"

    // alien.append(alien,health_bar)
    setPosition(alien,x,y)
    container.append(alien)
    GAME_STATE.enemies.push({alien ,x ,y , alien_heath: 5})
}

function init() {
    createPlayer(container)
    for(let i = 1; i <= 2 ; i ++){
        const y = 0
        const x = GAME_WIDTH / parseInt(i * 2)
        createAlien(x,y)
    }
}

function updatePlayer() {
    let player = document.querySelector("#space_ship")
    if(GAME_STATE.leftPress && GAME_STATE.playerX > 0){
        GAME_STATE.playerX -= PLAYER_MAX_SPEED
    }
    if(GAME_STATE.rightPress && GAME_STATE.playerX < (GAME_WIDTH - player_width)){
        GAME_STATE.playerX += PLAYER_MAX_SPEED
    }
    setPosition(player,GAME_STATE.playerX,GAME_STATE.playerY)

}

function createLazer(x , y) {
    x = x + (player_width / 2)
    let lazer = document.createElement("img")
    lazer.src = "images/laserBlue16.png"
    lazer.className = "lazer"
    container.append(lazer)
    setPosition(lazer,x,y)
    GAME_STATE.lazers.push({lazer , x , y})
}

function updateLazers() {
    const lazers = GAME_STATE.lazers
    for(let i = 0; i < lazers.length; i++){
        let lazer = lazers[i]
        lazer.y -= 20
        if(lazer.y < 100){
            checkPosition(lazer)
        }
        if(lazer.y > 0){
            setPosition(lazer.lazer,lazer.x,lazer.y)
        }else{
            lazer.lazer.remove()
            lazers.splice(lazers.indexOf(lazer),1)
        }
    }
}

function checkPosition(element) { 
    let enemies = GAME_STATE.enemies
    for (let i = 0; i < enemies.length; i++) {
        let alien = GAME_STATE.enemies[i]
        let x1 = alien.x 
        let x2 = alien.x + 100 
        if(x1 < element.x && x2 > element.x){
            alien.alien_heath -= 1
            if(alien.alien_heath == 0){
                alien.alien.remove()
                enemies.splice(enemies.indexOf(alien),1)
            }
            console.log(alien.alien_heath)
            element.lazer.remove()
            GAME_STATE.lazers.splice(GAME_STATE.lazers.indexOf(element),1)
            // let health = document.getElementById("health")
            // health.value -= 20; //Or whatever you want to do with it.
        }
    }
}

function update() {
    updatePlayer()
    updateLazers()
    if(GAME_STATE.mousePress && lazerCooldown <= 0){
        createLazer(GAME_STATE.playerX,GAME_STATE.playerY)
        lazerCooldown = lazerSpeed
    }

    lazerCooldown -= 1
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

init()
window.addEventListener("keydown",onKeyDown)
window.addEventListener("keyup",onKeyUp)
window.addEventListener("mousedown",()=> {
    GAME_STATE.mousePress = true 
})
window.addEventListener("mouseup",()=> {
    GAME_STATE.mousePress = false
})

window.requestAnimationFrame(update)
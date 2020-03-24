const container = document.querySelector(".game")

const KEY_CODE_LEFT = 65 // A
const KEY_CODE_RIGHT = 68 // D

const GAME_WIDTH = window.innerWidth 
const GAME_HEIGHT = window.innerHeight

const PLAYER_MAX_SPEED = 15
const lazerSpeed = 6

let player_width
let lazerCooldown = lazerSpeed

const GAME_STATE = {
    leftPress: false,
    rightPress: false,
    mousePress: false,
    playerX: 0,
    playerY: 0,
    lazers: []
}

function setPosition(element,x,y) {
    element.style.left = `${x}px`
    element.style.top = `${y}px`
}

function createPlayer(container) {

    let player = document.createElement("img")
    player.src = "images/pngguru.com.png"
    player.id = "space_ship"
    container.append(player)
    player_width = player.width
    GAME_STATE.playerX = GAME_WIDTH / 2 - (player_width / 2)
    GAME_STATE.playerY = GAME_HEIGHT - 110
    setPosition(player,GAME_WIDTH.playerX,GAME_STATE.playerY)
}

function init() {
    createPlayer(container)
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

function createLazer(container, x , y) {
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
        lazer.y > 0 ? setPosition(lazer.lazer,lazer.x,lazer.y) : lazer.lazer.remove()
    }
}

function update() {
    const container = document.querySelector(".game")
    updatePlayer()
    updateLazers()
    if(GAME_STATE.mousePress && lazerCooldown <= 0){
        createLazer(container,GAME_STATE.playerX,GAME_STATE.playerY)
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
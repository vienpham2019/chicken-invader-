const container = document.querySelector(".game")
const score = document.querySelector("p#score")
let score_num = 0

const KEY_CODE_LEFT = 65 // A
const KEY_CODE_RIGHT = 68 // D

const GAME_WIDTH = window.innerWidth 
const GAME_HEIGHT = window.innerHeight

const PLAYER_MAX_SPEED = 15
const lazerSpeed = 6

let AMOUNT_ALIEN = 2
const ALIEN_LAZER_SPEED = 20

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
    enemies_lazers: []
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

    setPosition(alien,x,y)
    container.append(alien)
    GAME_STATE.enemies.push({alien ,x ,y , alien_heath: 2, dx: 5 , dy: 2, lazer_cooldown: ALIEN_LAZER_SPEED})
}

function init() {
    createPlayer(container)
    score.innerText = "Score: 0"
    for(let i = 1; i <= AMOUNT_ALIEN ; i ++){
        create_alien_by_amount()
    }
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
        if(lazer.y < 400){
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

function createAlienLazer(x,y) {
    x = x + (player_width / 2)
    let lazer = document.createElement("img")
    lazer.src = "images/laserRed01.png"
    lazer.className = "lazer"
    container.append(lazer)
    setPosition(lazer,x,y)
    GAME_STATE.enemies_lazers.push({lazer , x , y})
}

function updateAlienLazers() {
    const lazers = GAME_STATE.enemies_lazers
    for(let i = 0; i < lazers.length; i++){
        let lazer = lazers[i]
        lazer.y += 20
        if(lazer.y < (GAME_WIDTH - player_width)){
            checkPositionForAlien(lazer)
        }
        if(lazer.y < GAME_WIDTH){
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
        if(x1 < element.x && x2 > element.x && element.y <= (alien.y + 80)){
            console.log(alien.y)
            console.log(element.y) 
            alien.alien_heath -= 1
            if(alien.alien_heath == 0){
                alien.alien.remove()
                enemies.splice(enemies.indexOf(alien),1)
                create_alien_by_amount()
                score_num += 1
                score.textContent = `Score: ${score_num}`
            }
            element.lazer.remove()
            GAME_STATE.lazers.splice(GAME_STATE.lazers.indexOf(element),1)
        }
    }
}

function checkPositionForAlien(lazer){
    let health = document.getElementById("health")

    let x1 = GAME_STATE.playerX
    let x2 = GAME_STATE.playerX + (player_width / 2)
    let y = GAME_HEIGHT - 100

    if(x1 <= lazer.x && x2 >= lazer.x && lazer.x < y){
        health.value -= 2; 
        lazer.lazer.remove()
        GAME_STATE.enemies_lazers.splice(GAME_STATE.enemies_lazers.indexOf(lazer),1)
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

    for(let alien_obj of GAME_STATE.enemies){
        if((alien_obj.x + 100) > GAME_WIDTH || (alien_obj.x) < 0){
            alien_obj.dx = -alien_obj.dx
            alien_obj.dy = (Math.random() * 3) + 1
        }
        if((alien_obj.y + 100) > 400 || (alien_obj.y) < 0){
            alien_obj.dy = -alien_obj.dy
        }
        let x = alien_obj.x += alien_obj.dx 
        let y = alien_obj.y += alien_obj.dy
        if(alien_obj.lazer_cooldown === 0){
            createAlienLazer(x,(y + 50))
            alien_obj.lazer_cooldown = ALIEN_LAZER_SPEED
        }
        alien_obj.lazer_cooldown -= 1
        updateAlienLazers()
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
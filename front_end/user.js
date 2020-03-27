const BACKGROUND_SONG = new Audio("songs/game_song2.mp3")
const ul = document.querySelector("#score_list")
const input = document.querySelector("#player_name_input")
const create_btn = document.querySelector("#start_game")
const players = []
const players_objs = []
let current_player

const create_player = (data) =>{
    players.push(data.player_obj.player_name)
    if(!players_objs.includes(data)){
        players_objs.push(data.player_obj)
    }
    let li_container = document.createElement("div")
    
    let li = document.createElement("li")
    li.innerText = data.player_obj.player_name
    li.className = "top_player_li"

    let h4 = document.createElement("h4")
    h4.innerText = `Highest Score: ${data.score}`
    h4.className = "top_player_h4"

    li_container.append(li,h4)
    ul.append(li_container)
}

const top_players = (players) => {
    let new_arr = []
    players.forEach(player => {
        let score_his = player.games.map(game => game.score)
        let highest_score = 0 
        highest_score = Math.max(...score_his)
        new_arr.push({player_obj: player, score: highest_score})
    })
    let top_players = new_arr.sort((a,b) => b.score - a.score).slice(0,5)
    top_players.forEach(player => create_player(player))
}

const make_game = (score) => {
    fetch("http://localhost:3000/games",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            score,
            player_id: current_player.id
        })
    })
    .then(() => load_highest_players())
}

create_btn.addEventListener("click", ()=> {
    if(input.value === ""){
        alert("input empty")
    }else{
        if(!players.includes(input.value)){
            fetch("http://localhost:3000/players",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    player_name: input.value.trim(),
                    age: 20
                })
            })
            .then(res => res.json())
            .then(player => {
                input.value = ""
                current_player = player
                console.log(current_player)
            })
        }else{
            current_player = players_objs.find(player => player.player_name === input.value)
        }
        init()
    }
})

const load_highest_players = () => {
    ul.innerHTML = ""
    input.value = ""
    current_player = ""
    fetch("http://localhost:3000/players")
    .then(res => res.json())
    .then(players => top_players(players))
}

load_highest_players()


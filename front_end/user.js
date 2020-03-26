const ul = document.querySelector("ul#list_container")
const create_btn = document.querySelector("#create_btn")
const input = document.querySelector("#input_playername")
const players = []

const create_player = (data) =>{
    players.push(data.player_name)
    let player_game_scores = data.games.map(game => game.score)

    let highest_score = 0

    if(player_game_scores.length != 0){
        highest_score = Math.max(...player_game_scores)
    }

    let li_container = document.createElement("div")
    
    let li = document.createElement("li")
    li.innerText = data.player_name 

    let h4 = document.createElement("h4")
    h4.innerText = `Highest Score: ${highest_score}`

    li_container.append(li,h4)
    ul.append(li_container)
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
                create_player(player)
            })
        }
    }
})



fetch("http://localhost:3000/players")
.then(res => res.json())
.then(players => {
    players.forEach(player => {
        create_player(player)
    })
})

console.log(players)
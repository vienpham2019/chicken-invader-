// fetch("http://localhost:3000/players")
// .then(res => res.json())
// .then(console.log)

fetch("http://localhost:3000/players",{
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        player_name: "viet pham",
        age: 17
    })
})
.then(res => res.json())
.then(console.log)
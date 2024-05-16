const socket= io()

let user
const chatBox = document.getElementById("boxChat")

Swal.fire({
    title: "User",
    input: "text",
    text: "Please, write your username to use our chat server.",
    inputValidator: (value) => {
        return !value && "You need a username to use our chat!"
    },
    allowOutsideClick: false,
}).then( result => {
    user = result.value
})


chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            socket.emit("message", {user: user, message: chatBox.value})
            chatBox.value = ""
        }
    }
})

socket.on("message", data => {
    let log = document.getElementById("messages")
    let messages = ""

    data.forEach( message => {
        messages = messages + `${message.user} said: ${message.message} <br>`
    })

    log.innerHTML = messages
})
// const user = prompt('Escribir nombre')
const socket = io()
const chatbox = document.getElementById('chatbox')

let user = sessionStorage.getItem('user') || ''
//3:18:52
if (!user) {
    Swal.fire({
        title: 'Auth',
        input: 'text',
        text: 'Set username',
        inputValidator : value => {
            return !value.trim() && 'Please, write a username'
        },
        allowOutsideClick: false
    })
        .then( result => {
            user = result.value
            document.getElementById('username').innerHTML = user
            sessionStorage.setItem( 'user' , user )
            socket.emit('new', user)
        })
} else {
    document.getElementById('username').innerHTML = user
    socket.emit('new', user)
}

    // es para enviar mensajes
chatbox.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        const message = chatbox.value.trim() // trim quita los espacios al principio y al final del contenido dado.
        if ( message.length > 0 ) {
            socket.emit('message', {
                user,
                message
            })

            chatbox.value = ''
        }
    }
})

// es para recibir mensajes

socket.on('logs', data => {
    console.log(data)
    const divLogs = document.getElementById('logs')
    let messages = ''
    data.forEach(msn => {
        messages = `<p><i>${msn.user}</i>: ${msn.message}</p>` + messages
    })

    divLogs.innerHTML = messages
})
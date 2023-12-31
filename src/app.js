import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import router from './router/views.router.js'

const PORT = process.env.PORT || 8080

const app = express()

const httpServer = app.listen(PORT, () => console.log('Listening...'))
const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/static',express.static(__dirname + '/public'))

app.get('/health', (req, res) => {
    res.send('Todo OKIDOKI!')
})

app.use('/', router)

const messages = []
io.on('connection', socket => {
    console.log('New conecction')
    socket.on( 'new', user => console.log(`${user} se acaba de conectar.`) )
    socket.on('message', data => {
        messages.push(data)
        io.emit('logs', messages)
    })
})
// 03:43:55
import express from 'express'
import productsRouter from "./routes/products.router.js"
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import exphbs from 'express-handlebars'
import './database.js'
import { Server } from "socket.io"
import { ProductManager } from './controllers/ProductManager.js'
import MessageModel from './models/message.model.js'
import session from "express-session"
import MongoStore from "connect-mongo"
import usersRouter from './routes/user.router.js'
import sessionsRouter from './routes/session.router.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'

const app = express()
const productManager = new ProductManager()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("./src/public"))

app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

const PORT = 8080

app.use(session({
    secret:"secretBaseCoderHouse",
    resave: true,
    saveUninitialized : true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://Coder53130:coderhouse@cluster0.00wvypr.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })
}))
app.use(passport.initialize())
app.use(passport.session())
initializePassport()

app.use('/api/products', productsRouter)
app.use('/api/carts',  cartsRouter)
app.use('/',  viewsRouter)
app.use('/api/users', usersRouter)
app.use('/api/sessions', sessionsRouter)

const httpServer = app.listen(PORT, () => {
    console.log(`Leyendo el puerto http://localhost:${PORT}`)
})
const io = new Server(httpServer)


io.on("connection", (socket) => {
    socket.on("mensaje", (data) => {
        console.log(data)
    })
    socket.on('prod', async(data) => {
        await productManager.addProducts(data)
    })
    socket.on('deleteProd', async(data) => {
        const productToDelete = await productManager.findProductByCode(data)
        await productManager.deleteProduct(productToDelete._id)
        socket.emit("prodsJson", '/api/products')
    })
    socket.emit("prodsJson", '/api/products')

    socket.on("message", async data => {
        await MessageModel.create(data)
        const messageData = await MessageModel.find()
        io.sockets.emit("message", messageData)
    })
})

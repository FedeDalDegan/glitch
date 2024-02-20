import express from 'express'
import productsRouter from "./routes/productsRouter.js"
import cartRouter from "./routes/cartRouter.js"
import chatRouter from './routes/chatRouter.js'
import upload from './config/multer.js'
import { __dirname } from "./path.js" // console.log(__dirname) // E:\CODE\CoderHouse\clases-backend\Clase 07 Express avanzado\src
import { engine } from "express-handlebars"
import { Server } from "socket.io"

// Configuraciones
const app = express()
const PORT = 8000

// Servidor
const server = app.listen(PORT, () => { // Movemos el servidor
    console.log(`Servidor abierto en puerto ${PORT} // http://localhost:${PORT}/products/ <- CTRL + CLICK`)
})

const io = new Server(server) // Nuevo servidor desde nuestro servidor

/*
Debemos de concatenar NUESTRO PROPIO DIRECTORIO a las carpetas absolutas (ej: "/public")
En __dirname guardamos la constante de nuestro directorio, y de ahi podremos navegar a nuestras demas carpetas y direcciones
*/

// MIddlewares (Establecemos comunicaciones/mediadores)
app.use(express.json()) // Permite poder ejecutar JSON
app.use("/static", express.static(__dirname + "/public")) // Definimos el enrutado de la carpeta publica. Es decir, en la ruta "static", voy a trabajar con los elementos publicos de mi aplicacion
app.engine("handlebars", engine())
app.set("view engine", "handlebars") // Para las vistas de mi aplicacion, usare handlebars
app.set("views", __dirname + "/views") // El lugar en donde guardamos las vistas
io.on("connection", (socket) =>{ // Establecemos conexion entre servidor y cliente
    console.log("Conexion con Socket.io (Cliente conectado)")

    socket.on("movimiento", info => { // Cunado el cliente envia un mensaje, lo capturo y lo muestro. (El mensaje es "movimiento")
        console.log(info)
    })

    socket.on("rendirse", info => { // Cunado el cliente envia un mensaje, lo capturo y lo muestro. (El mensaje es "Finalizar")
        console.log(info)

        socket.emit("mensaje-jugador", "Te has rendido. Una vez mas...") // Este mensaje nos llegara ya que es el que hemos enviado
        socket.broadcast.emit("rendicion", "El jugador se rindio") // Todas las conexiones reciben este mensaje. Es decir, los cientes que tengan establecida la comunicacion con el servidor. EVERY BROADCAST BUT THE SERVER. A nosotros no nos llegara
    })

    // ChatBot
    const mensajes = []
    socket.on("mensaje", info => {
        console.log(info)
        mensajes.push(info)
        io.emit("mensajeLogs", mensajes)
    })
})

// Rutas
app.use("/index", (req, res) => { // Pagina de inicio
    res.status(200).send("<h1>Bienvenido</h1>")
})
app.use("/products", productsRouter, express.static(__dirname + "/public"))
app.use("/static", express.static(__dirname + "/public")) // Definimos el enrutado de la carpeta publica. Es decir, en la ruta "static", voy a trabajar con los elementos publicos de mi aplicacion
app.use("/cart", cartRouter)
app.use("/chat", chatRouter, express.static(__dirname + "/public"))
// .single Hace referencia a enviar un archivo a la vez. (upload. Tiene muchos metodos. Se pueden enviar Arrays o mas de un archivo a la vez)
app.post("/upload", upload.single("product") , (req, res) => { // Generamos una ruta para poder cargar imagenes con metodo POST
    try{
        res.status(200).send("Imagen cargada correctamente")
    }catch(e){
        res.status(500).send("Error al cargar la imagen")
    }
})

/*
1) Importaciones necesarias
2) Definimos nuestra aplicacion y puerto
3) Definimos la carpeta y permitimos que express ejecuta .json
4) Definimos el enrutado 
5) Abrimos el servidor
*/
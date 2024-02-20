import { Router } from "express"

const chatRouter = Router()

chatRouter.get("/", (req, res) => {
    res.render("chat",{}) // Llave vacia {} porque no esta recibiendo informacion
})

export default chatRouter
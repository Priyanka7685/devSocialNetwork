import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

app.use(express.json())
app.use(cookieParser())

app.get("/api/test", (req, res) => {
    res.json({message: "API working"})
})


export {app}
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


// extra part
app.get("/api/test", (req, res) => {
    res.json({message: "API working"})
})

// extra part


import authRoutes from './routes/authRoutes.js'

app.use("/api/auth", authRoutes)


export { app }
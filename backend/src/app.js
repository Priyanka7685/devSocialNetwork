import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(
    cors({
        origin: "http://localhost:5173",
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

app.use(express.urlencoded({ extended: true }));

import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import postRoutes from './routes/postRoutes.js'

app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/post", postRoutes)


export { app }
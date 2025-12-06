import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'

import connectDB from './config/connectDB.js'
import userRouter from './routes/userRoutes.js'
import consultationRouter from './routes/consultationRoutes.js'
import goalRouter from './routes/goalRoutes.js'

connectDB()

const app = express()
const port = process.env.PORT || 3000

const allowedOrigins = ['http://localhost:5173']

app.use(cors({origin: allowedOrigins, credentials: true}))
app.use(express.json())
app.use(cookieParser())

app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})

app.use('/api/user', userRouter)
app.use('/api/consultations', consultationRouter)
app.use('/api/goals', goalRouter)
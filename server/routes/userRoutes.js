import express from 'express'
import { register, login, logout, isAuth, sendResetPasswordOtp, resetPassword, getUserData } from '../controllers/userControllers.js'
import userAuth from '../middlewares/userAuth.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/logout', logout)
userRouter.get('/is-auth', userAuth, isAuth)
userRouter.post('/send-reset-otp', sendResetPasswordOtp)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/get-user-data', userAuth, getUserData)

export default userRouter
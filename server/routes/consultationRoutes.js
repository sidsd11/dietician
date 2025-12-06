import express from 'express'
import { createConsultation, completeConsultation, deleteConsultation, editConsultation, getAllConsultations, getSingleConsultation, pendingConsultation } from '../controllers/consultationControllers.js'
import userAuth from '../middlewares/userAuth.js'

const consultationRouter = express.Router()

consultationRouter.post('/create-consultation', userAuth, createConsultation)
consultationRouter.patch('/edit-consultation/:id', userAuth, editConsultation)
consultationRouter.patch('/complete-consultation/:id', userAuth, completeConsultation)
consultationRouter.patch('/pending-consultation/:id', userAuth, pendingConsultation)
consultationRouter.delete('/delete-consultation/:id', userAuth, deleteConsultation)
consultationRouter.get('/get-all-consultations/:id', userAuth, getAllConsultations)
consultationRouter.get('/get-single-consultation/:id', userAuth, getSingleConsultation)

export default consultationRouter
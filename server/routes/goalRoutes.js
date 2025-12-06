import express from 'express'
import { createGoal, completeGoal, deleteGoal, editGoal, getAllGoals, getSingleGoal, pendingGoal } from '../controllers/goalControllers.js'
import userAuth from '../middlewares/userAuth.js'

const goalRouter = express.Router()

goalRouter.post('/create-goal', userAuth, createGoal)
goalRouter.patch('/edit-goal/:id', userAuth, editGoal)
goalRouter.patch('/complete-goal/:id', userAuth, completeGoal)
goalRouter.patch('/pending-goal/:id', userAuth, pendingGoal)
goalRouter.delete('/delete-goal/:id', userAuth, deleteGoal)
goalRouter.get('/get-all-goals/:id', userAuth, getAllGoals)
goalRouter.get('/get-single-goal/:id', userAuth, getSingleGoal)

export default goalRouter
import goalModel from '../models/goalModel.js'
import userModel from '../models/userModel.js'
import transporter from '../config/nodemailer.js'

export const createGoal = async (req, res) => {
    try {
        const {id, name, email} = req.user
        const {title, description, date} = req.body
        if (!title || !description || !date ) {
            return res.json({success: false, message: 'Missing details'})
        }

        const goal = new goalModel({userId: id, title, description, date, createdAt: Date.now(), editedAt: 0, completedAt: 0})
        await goal.save()

        const t = new Date(date)
        const day = String(t.getDate()).padStart(2, '0')
        const month = String(t.getMonth() + 1).padStart(2, '0')
        const year = String(t.getFullYear()).slice(-2)
        const finalDate = `${day}/${month}/${year}`

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Goal request',
            text: `Hi ${name}!. Your goal request for ${finalDate} has been requested. You can track all your goals from your profile.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'Goal requested'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const editGoal = async (req, res) => {
    try {
        const {id, name, email} = req.user
        const {title, description, date} = req.body
        const goalId = req.params.id
        if (!goalId) {
            return res.json({success: false, message: 'Missing details'})
        }

        const goal = await goalModel.findById(goalId)
        if (!goal) {
            return res.json({success: false, message: 'Goal does not exist'})
        }

        if (goal.userId !== id) {
            return res.json({success: false, message: 'You cannot access this goal'})
        }

        const updatedGoal = await goalModel.findByIdAndUpdate(
            goalId,
            {
                $set: {
                    title, description, date, editedAt: Date.now()
                }
            },
            {new: true, runValidators: true}
        )
        if (!updatedGoal) {
            return res.json({success: false, message: 'Goal does not exist'})
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Goal edited',
            text: `Hi ${name}!. Your ${goal.title} goal request has been edited. You can track all your goals from your profile.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'Goal edited'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const completeGoal = async (req, res) => {
    try {
        const {id, name, email} = req.user
        const goalId = req.params.id
        if (!goalId) {
            return res.json({success: false, message: 'Missing details'})
        }

        const goal = await goalModel.findById(goalId)
        if (!goal) {
            return res.json({success: false, message: 'Goal does not exist'})
        }

        if (goal.userId.toString() !== id) {
            return res.json({success: false, message: 'You cannot access this goal'})
        }

        const updatedGoal = await goalModel.findByIdAndUpdate(
            goalId,
            {
                $set: {
                    isCompleted: true,
                    completedAt: Date.now()
                }
            },
            {new: true, runValidators: true}
        )
        if (!updatedGoal) {
            return res.json({success: false, message: 'Goal does not exist'})
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Goal completed',
            text: `Hi ${name}!. Your ${goal.title} goal request has been marked as completed. You can track all your goals from your profile.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'Goal marked as completed'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const pendingGoal = async (req, res) => {
    try {
        const {id, name, email} = req.user
        const goalId = req.params.id
        if (!goalId) {
            return res.json({success: false, message: 'Missing details'})
        }

        const goal = await goalModel.findById(goalId)
        if (!goal) {
            return res.json({success: false, message: 'Goal does not exist'})
        }

        if (goal.userId.toString() !== id) {
            return res.json({success: false, message: 'You cannot access this goal'})
        }

        const updatedGoal = await goalModel.findByIdAndUpdate(
            goalId,
            {
                $set: {
                    isCompleted: false,
                    completedAt: 0
                }
            },
            {new: true, runValidators: true}
        )
        if (!updatedGoal) {
            return res.json({success: false, message: 'Goal does not exist'})
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Goal pending',
            text: `Hi ${name}!. Your ${goal.title} goal request has been marked as pending. You can track all your goals from your profile.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'Goal marked as pending'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const deleteGoal = async (req, res) => {
    try {
        const {id, name, email} = req.user
        const goalId = req.params.id
        if (!goalId) {
            return res.json({success: false, message: 'Missing details'})
        }

        const goal = await goalModel.findById(goalId)
        if (!goal) {
            return res.json({success: false, message: 'Goal does not exist'})
        }

        if (goal.userId.toString() !== id) {
            return res.json({success: false, message: 'You cannot access this goal'})
        }
        const updatedGoal = await goalModel.findByIdAndDelete(goalId)
        if (!updatedGoal) {
            return res.json({success: false, message: 'Goal does not exist'})
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Goal deleted',
            text: `Hi ${name}!. Your ${goal.title} goal has been deleted. You can track all your goals from your profile.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'Goal deleted'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const getAllGoals = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.json({success: false, message: 'Missing details'})
        }

        const goals = await goalModel.find({userId: id}).sort({createdAt: -1})

        return res.json({success: true, message: 'All goals fetched successfully', goals})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const getSingleGoal = async (req, res) => {
    try {
        const userId = req.user.id
        const goalId = req.params.id
        if (!goalId) {
            return res.json({success: false, message: 'Missing details'})
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({success: false, message: 'User does not exist'})
        }

        const goals = await goalModel.findById(goalId)
        if (goals.userId.toString() === userId) {
            return res.json({success: true, message: 'Goal fetched successfully', goals})
        }
        else {
            return res.json({success: true, message: 'You cannot access this goal'})
        }
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}
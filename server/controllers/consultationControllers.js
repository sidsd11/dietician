import consultationModel from '../models/consultationModel.js'
import userModel from '../models/userModel.js'
import transporter from '../config/nodemailer.js'

export const createConsultation = async (req, res) => {
    try {
        const {id, name, email} = req.user
        const {title, description, date} = req.body
        if (!title || !description || !date ) {
            return res.json({success: false, message: 'Missing details'})
        }

        const consultation = new consultationModel({userId: id, title, description, date, createdAt: Date.now(), editedAt: 0, completedAt: 0})
        await consultation.save()

        const t = new Date(date)
        const day = String(t.getDate()).padStart(2, '0')
        const month = String(t.getMonth() + 1).padStart(2, '0')
        const year = String(t.getFullYear()).slice(-2)
        const finalDate = `${day}/${month}/${year}`

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Consultation request',
            text: `Hi ${name}!. Your consultation request for ${finalDate} has been requested. You can track all your consultations from your profile.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'Consultation requested'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const editConsultation = async (req, res) => {
    try {
        const {id, name, email} = req.user
        const {title, description, date} = req.body
        const consultationId = req.params.id
        if (!consultationId) {
            return res.json({success: false, message: 'Missing details'})
        }

        const consultation = await consultationModel.findById(consultationId)
        if (!consultation) {
            return res.json({success: false, message: 'Consultation does not exist'})
        }

        if (consultation.userId !== id) {
            return res.json({success: false, message: 'You cannot access this consultation'})
        }

        const updatedConsultation = await consultationModel.findByIdAndUpdate(
            consultationId,
            {
                $set: {
                    title, description, date, editedAt: Date.now()
                }
            },
            {new: true, runValidators: true}
        )
        if (!updatedConsultation) {
            return res.json({success: false, message: 'Consultation does not exist'})
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Consultation edited',
            text: `Hi ${name}!. Your ${consultation.title} consultation request has been edited. You can track all your consultations from your profile.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'Consultation edited'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const completeConsultation = async (req, res) => {
    try {
        const {id, name, email} = req.user
        const consultationId = req.params.id
        if (!consultationId) {
            return res.json({success: false, message: 'Missing details'})
        }

        const consultation = await consultationModel.findById(consultationId)
        if (!consultation) {
            return res.json({success: false, message: 'Consultation does not exist'})
        }

        if (consultation.userId.toString() !== id) {
            return res.json({success: false, message: 'You cannot access this consultation'})
        }

        const updatedConsultation = await consultationModel.findByIdAndUpdate(
            consultationId,
            {
                $set: {
                    isCompleted: true,
                    completedAt: Date.now()
                }
            },
            {new: true, runValidators: true}
        )
        if (!updatedConsultation) {
            return res.json({success: false, message: 'Consultation does not exist'})
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Consultation completed',
            text: `Hi ${name}!. Your ${consultation.title} consultation request has been marked as completed. You can track all your consultations from your profile.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'Consultation marked as completed'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const pendingConsultation = async (req, res) => {
    try {
        const {id, name, email} = req.user
        const consultationId = req.params.id
        if (!consultationId) {
            return res.json({success: false, message: 'Missing details'})
        }

        const consultation = await consultationModel.findById(consultationId)
        if (!consultation) {
            return res.json({success: false, message: 'Consultation does not exist'})
        }

        if (consultation.userId.toString() !== id) {
            return res.json({success: false, message: 'You cannot access this consultation'})
        }

        const updatedConsultation = await consultationModel.findByIdAndUpdate(
            consultationId,
            {
                $set: {
                    isCompleted: false,
                    completedAt: 0
                }
            },
            {new: true, runValidators: true}
        )
        if (!updatedConsultation) {
            return res.json({success: false, message: 'Consultation does not exist'})
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Consultation pending',
            text: `Hi ${name}!. Your ${consultation.title} consultation request has been marked as pending. You can track all your consultations from your profile.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'Consultation marked as pending'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const deleteConsultation = async (req, res) => {
    try {
        const {id, name, email} = req.user
        const consultationId = req.params.id
        if (!consultationId) {
            return res.json({success: false, message: 'Missing details'})
        }

        const consultation = await consultationModel.findById(consultationId)
        if (!consultation) {
            return res.json({success: false, message: 'Consultation does not exist'})
        }

        if (consultation.userId.toString() !== id) {
            return res.json({success: false, message: 'You cannot access this consultation'})
        }
        const updatedConsultation = await consultationModel.findByIdAndDelete(consultationId)
        if (!updatedConsultation) {
            return res.json({success: false, message: 'Consultation does not exist'})
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Consultation deleted',
            text: `Hi ${name}!. Your ${consultation.title} consultation has been deleted. You can track all your consultations from your profile.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'Consultation deleted'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const getAllConsultations = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.json({success: false, message: 'Missing details'})
        }

        const consultations = await consultationModel.find({userId: id}).sort({createdAt: -1})

        return res.json({success: true, message: 'All consultations fetched successfully', consultations})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const getSingleConsultation = async (req, res) => {
    try {
        const userId = req.user.id
        const consultationId = req.params.id
        if (!consultationId) {
            return res.json({success: false, message: 'Missing details'})
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({success: false, message: 'User does not exist'})
        }

        const consultations = await consultationModel.findById(consultationId)
        if (consultations.userId.toString() === userId) {
            return res.json({success: true, message: 'Consultation fetched successfully', consultations})
        }
        else {
            return res.json({success: true, message: 'You cannot access this consultation'})
        }
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}
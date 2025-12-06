import mongoose from 'mongoose'

const goalSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: Number, required: true},
    isCompleted: {type: Boolean, default: false},
    createdAt: {type: Number, dafault: 0},
    completedAt: {type: Number, dafault: 0},
    editedAt: {type: Number, dafault: 0}
}, {timestamps: true})

const goalModel = mongoose.models.goal || mongoose.model('goal', goalSchema)

export default goalModel
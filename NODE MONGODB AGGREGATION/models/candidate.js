const mongoose = require('mongoose')
const { Schema } = mongoose


const candidateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
})


module.exports = mongoose.model('candidate', candidateSchema)

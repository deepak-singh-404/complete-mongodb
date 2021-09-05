const mongoose = require('mongoose')
const { Schema } = mongoose


const testScoreSchema = new Schema({
    test: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true,
        default: 0
    },
    maxMarks:{
        type: Number,
        required: true,
        default: 10
    },
    candidateId:{
        type: Schema.Types.ObjectId,
        ref: 'candidate'
    }
})


module.exports = mongoose.model('testScore', testScoreSchema)

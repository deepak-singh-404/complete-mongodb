
//Models
const { response } = require('express');
const Candidate = require('../models/candidate')
const TestScore = require('../models/testScore')




module.exports = {
    addCandidate: async (req, res, next) => {
        try {
            let errors = {}
            const { name, email} = req.body;
            const candidate = await Candidate.findOne({ email })
            if (candidate) {
                errors.email = "Email already exist"
                return res.status(400).json(errors)
            }
            const newCandidate = await new Candidate({
                name,
                email
            })
            await newCandidate.save()
            res.status(200).json({
                message:"Candidate added successfully",
                success: true,
                response: newCandidate
         })
        }
        catch (err) {
            console.log("Error in addCandidate", err.message)
            return res.status(400).json({ message: `Error in addCandidate ${err.message}` })
        }
    },
    addMarks: async(req,res,next)=>{
        try{
            let errors = {}
            const {test, marks, candidateId} = req.body
            const candidate =  await Candidate.findById(candidateId)
            if(!candidate){
                return res.status(404).json({
                    message:"Invalid candidateId",
                    success: false,
                })
            }
            const score = await TestScore.findOne({ $and: [{candidateId}, {test}, {marks}]})
            if(score){
                return res.status(404).json({
                    message:"Marks already added, do you want to update",
                    success: false,
                    response: score
                })
            }
            const testScore = await new TestScore({
                test,
                marks,
                candidateId
            })
            await testScore.save()
            return res.status(201).json({
                message: "Score added successfully",
                success: true,
                respsose: testScore
            })
        }
        catch(err){
            console.log("Error in addCandidate", err.message)
            return res.status(400).json({ message: `Error in addCandidate ${err.message}` })
        }
    },
    getAverageMarksOfCandidate: async(req, res, next)=>{
        try{
            const marks = await TestScore.aggregate([
                {$group: {
                    _id: "$candidateId",
                    avgMarks:  {$avg: "$marks"},
                }},
                {
                  
                }
            ])
            return res.status(201).json({
                message: "Average marks of candidate",
                success: true,
                respsose: marks
            })
        }
        catch(err){
            console.log("Error in getAverageMarksOfCandidate", err.message)
            return res.status(400).json({ message: `Error in getAverageMarksOfCandidate ${err.message}` })
        }
    },
    getHighestScorer: async(req, res, next)=>{
        try{
            const marks = await TestScore.aggregate([
                {$group: {
                    _id: "$candidateId",
                    totalMarks:  {$sum: "$marks"},
                }}
            ])
            const max = marks.reduce(function(prev, current) {
                return (prev.totalMarks > current.totalMarks) ? prev : current
            })
            return res.status(201).json({
                message: "Get marks",
                success: true,
                respsose: max
            })
        }
        catch(err){
            console.log("Error in getHighestScorer", err.message)
            return res.status(400).json({ message: `Error in getHighestScorer ${err.message}` })
        }
    },
}



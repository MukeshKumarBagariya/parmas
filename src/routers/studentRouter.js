const express = require('express')
const Student = require('../models/students')

const router = new express.Router()

router.post('/student/signup', async (req, res) => {
    const student = new Student(req.body)
    try{
        await student.save()
        res.status(201).send(student) 
    } catch(e) {
        res.status(400).send(e)
    }
})

router.patch('/student/update/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdates = ['name','phone','emailId','password']
    const isValidUpdate = updates.every((update) => validUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(404).send({
            error: 'Invalid Update!'
        })
    }
    try{
        const student = await Student.findById(req.params.id)
        updates.forEach((update) => student[update] = req.body[update])
        await student.save()
        if(!student){
            return res.status(404).send()
        } 
        res.status(201).send(student)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/student/delete/:id', async (req, res) => {
    try{
        const student = await Student.findByIdAndDelete(req.params.id)
        if(!student){
            return res.status(404).send({
                error: 'No Student found'
            }) 
        }
        res.status(201).send(student)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/student/login', async (req, res) => {
    try{
        const student = await Student.findByCredentials(req.body.emailId, req.body.password)
        const token = await student.generateAuthToken()
        res.send({ student, token })
    } catch(e){
        res.status(400).send(e)
    }
})

module.exports = router
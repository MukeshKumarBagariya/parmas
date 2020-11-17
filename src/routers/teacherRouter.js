const express = require('express')
const Teacher = require('../models/teacher')

const router = new express.Router()

router.post('/teacher/signup', async (req, res) => {
    const teacher = new Teacher(req.body)
    try{
        await teacher.save()
        const token = teacher.generateAuthToken()
        res.status(201).send({teacher, token})
    } catch(e){
        res.status(400).send(e)
    }
})

router.get('/teacher/all', async (req, res) => {
    try{
        const teachers = await Teacher.find({})
        res.status(201).send(teachers)
    } catch(e){
        res.status(400).send(e)
    }
})

router.get('/teacher/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const pTeacher = await Teacher.findById(_id)
        if(!pTeacher){
            return res.status(404).send()
        }
        res.status(201).send(pTeacher) 
    } catch(e){
        res.status(400).send(e)
    }
})

router.patch('/teacher/update/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name','emailId','experience']
    const isValidUpdate = updates.every((update) => allowedUpdate.includes(update))
    if(!isValidUpdate) {
        return res.status(400).send({
            error: 'Invalid Updates!'
        })
    }
    try{
        const teacher = await Teacher.findById(req.params.id)
        updates.forEach((update) => teacher[update] = req.body[update])
        await teacher.save()
        if(!teacher){
            return res.status(404).send()
        }
        res.status(201).send(teacher)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/teacher/delete/:id', async (req, res) => {
    try{
        const teacher = await Teacher.findByIdAndDelete(req.params.id)
        if(!teacher){
            return res.status(404).send()
        }
        res.status(201).send(teacher)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/teacher/login', async (req, res) => {
    try{
        const teacher = await Teacher.findByCredentials(req.body.emailId, req.body.password)
        const token = await teacher.generateAuthToken()
        res.send({
            teacher, token
        })
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router
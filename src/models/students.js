const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, phone: {
        type: Number,
        required: true,
        trim: true
    }, emailId: {
        type: String,
        require: true,
        trim: true
    }, password: {
        type: String,
        require: true,
        minlength: 8,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password can not contain "Password"')
            }
        }
    }, tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
//
studentSchema.methods.generateAuthToken = async function(){
    const student = this
    const token = jwt.sign({_id: student._id.toString()}, 'parma')
    student.tokens = student.tokens.concat({token})
    await student.save()
    return token
}

//loging studen in
studentSchema.statics.findByCredentials = async (emailId, password) => {
    const student = await Student.findOne({emailId})
    if(!student){
        throw new Error('Unable to login')
    }
    const isValidPassword = await bcrypt.compare(password, student.password)
    if(!isValidPassword){
        throw new Error('Unable to login')
    }
    return student
}

//hashing the password
studentSchema.pre('save', async function (next) {
    const student = this;
    if(student.isModified('password')){
        student.password = await bcrypt.hash(student.password, 8)
    }
    next()
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student
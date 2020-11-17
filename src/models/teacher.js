const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    }, emailId: {
        type: String,
        unique: true,
        require: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please enter a valid email id")
            }
        }
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
    }, experience: {
        type: Number,
        require: true,
        trim: true,
        validate(value){
            if(value < 1){
                throw new Error("You must have one year of experience")
            }
        }
    }, tokens: [{
        token: {
            type: String,
            required: true
    }
    }]
})
//generating tokens
teacherSchema.methods.generateAuthToken = async function(){
    const teacher = this;
    const token = jwt.sign({_id: teacher._id.toString()}, 'parma')
    teacher.tokens = teacher.tokens.concat({ token })
    await teacher.save()
    return token
}

//make a user to login
teacherSchema.statics.findByCredentials = async (emailId, password) => {
    const teacher = await Teacher.findOne({emailId})
    if(!teacher) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, teacher.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return teacher;
}

//hashing password
teacherSchema.pre('save', async function(next) {
    const teacher = this;
    if(teacher.isModified('password')) {
        teacher.password = await bcrypt.hash(teacher.password, 8)
    }
    next()
})

const Teacher = mongoose.model('Teacher', teacherSchema)

module.exports = Teacher
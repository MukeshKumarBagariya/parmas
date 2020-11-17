const express = require('express');
require('./db/mongoose')
const studentRouter = require('./routers/studentRouter')
const teacherRouter = require('./routers/teacherRouter')
const home = require('./routers/home')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(teacherRouter)
app.use(studentRouter)
app.use(home)

app.listen(port, () => {
    console.log('Running')
})
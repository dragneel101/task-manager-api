const express = require('express')
const mongoose = require('mongoose')
const userRoute = require('./routes/user')
const taskRoute = require('./routes/task')
const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRoute)
app.use(taskRoute)
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

app.listen(port, () => {
    console.log('Server is connected to port ' + port)
})


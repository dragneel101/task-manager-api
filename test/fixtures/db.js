const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'minu',
    email: 'minu@example.com',
    password: 'House11@',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}


const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'first test this is just a test data',
    completed: false,
    author: userOne._id
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'second task this is just a test data',
    completed: true,
    author: userOne._id
}
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task this is just a test data',
    completed: false,
    author: userTwo._id
}

const setupDB = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}


module.exports = { userOneId, userOne, userTwoId, userTwo, setupDB, taskOne, taskThree, taskTwo }
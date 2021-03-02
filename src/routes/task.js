const Task = require('../models/task')
const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth')
const User = require('../models/user')



//route to create new task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        author: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

//route to show tasks
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }


    try {
        await req.user.populate({
            path: 'userTasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.userTasks)
    } catch (e) {
        res.status(500).send()
    }
})

//route to get individual task
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, author: req.user._id })
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})

//route to update tasks
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, author: req.user._id })
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (err) {
        res.status(400).send(err);
    }
})


//route to delete tasks
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, author: req.user._id })
        if (!task) {
            return res.status(404).send();
        }
        res.send(task)
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router
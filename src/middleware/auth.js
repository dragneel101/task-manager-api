const jwt = require('jsonwebtoken')
const { Error } = require('mongoose')
const User = require('../models/user')
const JWT_SECRET = process.env.JWT_SECRET

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '').trim()
        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()

    } catch (err) {
        res.status(401).send({ error: 'please authenticate' })
    }

}

module.exports = auth
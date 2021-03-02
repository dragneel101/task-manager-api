const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Task = require('./task');
const JWT_SECRET = process.env.JWT_SECRET

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid email')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) { throw new Error('Age must be positive') }
        }
    },
    password: {
        type: String,
        required: [true, 'why no password'],
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password cannot contain word "password"')
            }
        }

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},
    {
        timestamps: true
    })

userSchema.virtual('userTasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'author'
})

// hidepassword and tokens
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject
}


//create and save tokens
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, { expiresIn: '1 days' });
    user.tokens = user.tokens.concat({ token: token });
    await user.save();
    return token;
}


// verifying email and password
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


//hash the password
userSchema.pre('save',
    async function (next) {
        const user = this;
        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, saltRounds);
        }
        next();
    })

//delete user task when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ author: user._id })
    next()
})

//user model
const User = mongoose.model('User', userSchema);


module.exports = User;
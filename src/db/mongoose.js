const mongoose = require('mongoose');
const validator = require('validator');
mongoose.connect('mongodb://localhost:27017/task-manager-api', { useNewUrlParser: true, useUnifiedTopology: true });



//task model
const task = mongoose.model('tasks', {
    description: {
        type: String,
        trim: true,
        required: true,

    },
    completed: {
        type: Boolean,
        default: false
    }
});











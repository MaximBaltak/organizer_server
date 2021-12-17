const {Schema, model} = require('mongoose')
const Task = new Schema({
    userId: {type: String, required: true},
    title: {
        type: String,
        required: true,
    },
    dateStart: {
        type: String,
    },
    dateEnd: {
        type: String,
    },
    day: {
        text: {type: String},
        color: {type: String}
    },
    state: {
        text: {type: String},
        color: {type: String}
    },
    border: {type: String, required: true},
    check: {type: Boolean, required: true},

})
module.exports = model('Task', Task)
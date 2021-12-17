const {Schema, model} = require('mongoose')
const Goal = new Schema({
    title: {
        type: String,
        required: true,
    },
    dateStart: {
        type: String,
    },
    dateEnd: {
        type: Date,
    },
    day: {
        text: {type: String},
        color: {type: String}
    },
    state: {
        text: {type: String},
        color: {type: String}
    },
    todo: [{ref: 'TaskFormGoal'}],
    percent: Number,
    colorPercent: String,
    borderColor: String,
})
module.exports = model('Goal', Goal)
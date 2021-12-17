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
    percent: {type:Number,required:true},
    colorPercent:{type:String,required:true},
    borderColor:  {type:String,required:true},
})
module.exports = model('Goal', Goal)
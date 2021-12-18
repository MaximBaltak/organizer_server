const {Schema, model} = require('mongoose')
const Goal = new Schema({
    userId:{type:String,required:true,unique:false},
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
        text: {type: String,required:true},
        color: {type: String,required:true}
    },
    tasks: [{
        title: {type:String,required:true,},
        check: {type:Boolean,required:true},
        color: {type:String,required:true},
        showButton: {type:Boolean,required:true},
        borderColor: {type:String,required:true},
    }
    ],
    percent: {type:Number,required:true},
    colorPercent:{type:String,required:true},
    borderColor:  {type:String,required:true},
})
module.exports = model('Goal', Goal)
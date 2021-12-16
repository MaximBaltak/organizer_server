const {Schema,model}=require('mongoose')
const Task=new Schema({
    userId:{type:String,required:true},
    title:{
        type:String,
        required:true,
    },
    dateStart:{
        type:Date,
    },
    dateEnd:{
        type:Date,
    },
    day:{
        text:{type:String},
        color:{type:String}
    },
    state:{
        text:{type:String},
        color:{type:String}
    },
    border:{type:String},
    check:{type:Boolean},

})
module.exports=model('Task',Task)
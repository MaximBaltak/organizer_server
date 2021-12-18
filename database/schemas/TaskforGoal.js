const {Schema,model}=require('mongoose')
const  TaskForGoal=new Schema({
    goalId:{type:String,required:true},
    title: {type:String,required:true},
    check: {type:Boolean,required:true},
    color: {type:String,required:true},
    showButton: {type:Boolean,required:true},
    borderColor:{type:String,required:true}
})
module.exports=model('TaskForGoal',TaskForGoal)
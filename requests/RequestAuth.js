const User=require('./../database/schemas/User')
const Task=require('./../database/schemas/Task')
class RequestAuth{
    async signUp(req,res){
        try {
            const task= await new Task({
                userId:'jkk2882jh272762',
                title: 'test 1',
                dateStart:null,
                dateEnd:null,
                border: 'grey',
                check: false,
            })
            await task.save()
            const user= await new User({
                username:'test723',
                password:'uyhs',
            })
            await user.save()
            res.json({message:'ok'})
        }catch (e){
            res.status(400).json({message: 'error'})
        }
    }
}
module.exports= new RequestAuth()
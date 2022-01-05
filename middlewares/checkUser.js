const User = require("./../database/schemas/User");
const checkUser= async (dataUser)=>{
        const user=await User.findOne({username:dataUser.login})
        console.log(user)
        if(user){
            return 200
        }
        return 403

}
module.exports=checkUser
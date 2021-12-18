const User = require("./../database/schemas/User");
const bcrypt = require("bcrypt");
const checkUser= async (dataUser)=>{
    try{
        const user=await User.findOne({username:dataUser.username})
        if(user){
            if(!bcrypt.compareSync(dataUser.user.password,user.password)){
                return 403
            }
        }
        return 200
    }catch (e){
        return 500
    }
}
module.exports=checkUser
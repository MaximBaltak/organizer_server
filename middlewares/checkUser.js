const User = require("./../database/schemas/User");
const bcrypt = require("bcrypt");
const checkUser= async (dataUser)=>{
        const user=await User.findOne({username:dataUser.login})
        console.log(user)
        if(user){
            if(!bcrypt.compareSync(dataUser.password,user.password)){
                console.log(user)
                return 403
            }
            return 200
        }
        return 403

}
module.exports=checkUser
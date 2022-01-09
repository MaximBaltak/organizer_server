const User=require('./../database/schemas/User')
const checkUser=require('./../middlewares/checkUser')
const nodemailer=require('nodemailer')
const jwt=require('jsonwebtoken')
require('dotenv').config()
class requestConfirm{
    async checkUser(req,res){
        if(!req.query){
            return res.status(400).json({message:'нет данных'})
        }
        const {token}=req.query
        jwt.verify(token,process.env.SECRET_KEY,(err,decode)=>{
            if(err){
                return res.status(400).json({message:'Невалидный токен'})
            }
            req.user=decode
        })
            const status=await checkUser(req.user)
            switch (status){
                case 403:
                    return res.status(status).json({message:'the user is not logged in'})
                default:
                    break
            }
        try {
            await User.updateOne({username:req.user.login},{$set:{confirmEmail:true}})
            return res.status(200).json({message:'Почта подтверждена',confirmEmail: true})
        }catch (e){
            return res.status(500).json({message:'почта не подтверждена'})
        }

    }
    async sendEmailConfirm(req,res){
        try{
            const status=await checkUser(req.user)
            switch (status){
                case 403:
                    return res.status(status).json({message:'the user is not logged in'})
                default:
                    break
            }
            const user=await User.findOne({username:req.user.login})
            try {
                const transport=nodemailer.createTransport({
                    host: process.env.HOST_SMTP,
                    port: process.env.PORT_SMTP,
                    secure: process.env.SECURE_SMTP,
                    auth: {
                        user: process.env.LOGIN_SMTP,
                        pass: process.env.PASSWORD_SMTP
                    }
                })
                const token=req.headers.authorization.split(' ')[1]
                const link=`${process.env.LINK_APP}confirm/${token}`
                const data=`<p>Для подтверждение почты перейдите по ссылке</p>
                                <p>Письмо сформировано сервером, поэтому не отвечайте на него</p>
                                 <a href=${link}>Подтвердите почту</a>`
                await transport.sendMail({
                    from:'maksim.baltak1998@mail.ru',
                    to: user.email,
                    subject:'Подтверждение почты',
                    html: data
                })
                return res.status(200).json({message:'Письмо отправлено'})
            }catch (e){
                return res.status(500).json({message:'Письмо не отправлено'})
            }
        }catch (e){
            return res.status(500).json({message:'error is server'})
        }
    }
}
module.exports=new requestConfirm()


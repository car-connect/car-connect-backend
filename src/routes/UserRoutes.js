require('dotenv').config()
const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const session=require('express-session');
const passportLocalMongoose=require('passport-local-mongoose')
const jwt=require('jsonwebtoken')
const {UserModel}=require('./../../config/connection')
const passport=require('passport')
const nodemailer=require('nodemailer') 




let verifyToken=(req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token=req.headers.authorization.split(' ')[1]

    if(token==null){
        return res.status(404).send('UNauth')
    }
    let payload=jwt.verify(token,process.env.JWT_SECRET)
    if(!payload){
        return res.send(403).send('unaUTH')
    }
    req.userId=payload.subject
    next()
}
router.post('/signup',(req,res)=>{
   
    UserModel.register({username:req.body.username,name:req.body.name},req.body.password,(err,user)=>{
        if(err) {
            console.log(err);
            res.json(err)
        }
        else{
            console.log(user);
            passport.authenticate("local")(req,res,()=> {
                let token=jwt.sign(user.username,"qwerty")
                let output=
                `<h2>CAR-CONNECT</h2>
                <p>Welcome to CAR_CONNECT</p>
                <h5>
                Dear ${req.body.username}:
                
                Please paste the following key to verify the email address on your account</h5>
                <a>${token}</a>
                <h3>Message</h3>
                `;
               
              // create reusable transporter object using the default SMTP transport
              let transporter = nodemailer.createTransport({
                service:'gmail',
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: 'carconnect00@gmail.com', // generated ethereal user
                  pass: 'yheipsxphuwnrsig', // generated ethereal password
                },
                tls:{
                    rejectUnauthorized:false
                }
              });
            
              // send mail with defined transport object
              let info =  transporter.sendMail({
                from: '"CAR-CONNECT" <anugrah.futura@gmail.com>', // sender address
                to: req.body.username, // list of receivers
                subject: "Email-Authentication", // Subject line
                text: "Content-main", // plain text body
                html: output, // html body
              });
            
              console.log("Message sent: %s", info.messageId);
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            
              // Preview only available when sending through an Ethereal account
              console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            //   res.render('test',{msg:'email has been sent'})
                res.json({user:user,message:'authenticated'})
            })
        }

    })
})
router.post('/login',(req,res)=>{
    const user=new UserModel({
        username:req.body.username,
        password:req.body.password
    })
   
    req.login(user,(err)=>{
        if(err){
            console.log(err);
            res.json(err)
        }
        else{
            passport.authenticate("local")(req,res,()=>{
                console.log("done",user);
              let token= jwt.sign(user.username+user.password,process.env.JWT_SECRET)
                res.json({user:req.user,message:'authenticated',token:token})
                // res.redirect('/user/home')
            })
        }
    })
 
})
router.get('/home',(req,res)=>{
    console.log("user",req.user);
    if(req.isAuthenticated()){
        res.json('authenticated')
    }else{
        res.json('not auth')
    }
})
router.post('/authpass',(req,res)=>{
    jwt.verify(req.body.key,'qwerty',(err,decoded)=>{
        if(err) throw err
        else{
            console.log(decoded);
            res.json({user:decoded})
        }
    })
})

module.exports=router
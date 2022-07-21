require('dotenv').config()
const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const session=require('express-session');
const passportLocalMongoose=require('passport-local-mongoose')
const {UserModel}=require('./../../config/connection')
const passport=require('passport')

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
   
    UserModel.register({username:req.body.username},req.body.password,(err,user)=>{
        if(err) {
            console.log(err);
            res.json(err)
        }
        else{
            console.log(user);
            passport.authenticate("local")(req,res,()=> {
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
                res.json({user:user,message:'authenticated'})
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

module.exports=router
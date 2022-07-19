const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const session=require('express-session');
const passportLocalMongoose=require('passport-local-mongoose')
const {UserModel}=require('./../../config/connection')
const passport=require('passport')

router.get('/',(req,res)=>{
    res.send("qwerty")
})
router.post('/signup',(req,res)=>{
   
    UserModel.register({username:req.body.username},req.body.password,(err,user)=>{
        if(err) {
            console.log(err);
            res.json(err.message)
        }
        else{
            console.log(user);
            passport.authenticate("local")(req,res,()=> {
                res.json('add')
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
            res.json('not')
        }
        else{
            passport.authenticate("local")(req,res,()=>{
                res.json(user)
                // res.redirect('/user/home')
            })
        }
    })
 
})
router.get('/home',(req,res)=>{
    if(req.isAuthenticated()){
        res.json('authenticated')
    }else{
        res.json('not auth')
    }
})

module.exports=router
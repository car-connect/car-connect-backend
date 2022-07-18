const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const {UserModel}=require('./../../config/connection')
const passport=require('passport')

router.get('/',(req,res)=>{
    res.send("qwerty")
})
router.post('/signup',async(req,res)=>{
   
    UserModel.register({email:req.body.email,username:req.body.username},req.body.password,(err,user)=>{
        if(err) {
            console.log(err);
            res.json(err.message)
        }
        else{
            console.log(user);
            passport.authenticate("local")(req,res,()=> {
                res.json("User Inserted")
            })
        }

    })
})
router.post('/login',(req,res)=>{
    const user=new UserData({
        username:req.body.username,
        password:req.body.password
    })
    req.login(user,(err)=>{
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local")(req,res,()=>{
                res.json("authenticated")
            })
        }
    })
 
})

module.exports=router
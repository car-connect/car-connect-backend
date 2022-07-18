const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const {UserModel}=require('./../../config/connection')

router.get('/',(req,res)=>{
    res.send("qwerty")
})
router.post('/',async(req,res)=>{
    let hashPassword=await bcrypt.hash(req.body.password,10)

    let Data=new UserModel({
        username:req.body.username,
        email:req.body.email,
        password:hashPassword
    })
    console.log(Data);
    Data.save((err)=>{
        if(err) throw err
        else{
            res.json("Data Added")
        }
    })
})

module.exports=router
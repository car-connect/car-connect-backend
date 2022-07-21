require('dotenv').config()
const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {AdminModel}=require('./../../config/connection')
let jwt_secret=process.env.JWT_SECRET


router.post('/login',async(req,res)=>{

   
    
    AdminModel.findOne({username:req.body.username}).then((data)=>{
        if(data){
            bcrypt.compare(req.body.password,data.password,(err,admin)=>{
                if(err) throw err
                else{
                    if(admin==true){
                        console.log(req.body.username);
                        let payload={subject:req.body.email+req.body.password}
                      let token=  jwt.sign(payload,jwt_secret)
                        res.json({auth:admin,token:token})
                    }
                    else{
                        res.json({auth:admin})
                    }

                }
            })
        }
        else{
            res.json('no')
        }
       
    })


})


module.exports=router
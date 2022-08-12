require('dotenv').config()
const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {AdminModel,ProductModel, UserModel}=require('./../../config/connection')
let jwt_secret=process.env.JWT_SECRET


router.post('/login',async(req,res)=>{

   
    
    AdminModel.findOne({username:req.body.username}).then((data)=>{
        if(data){
            bcrypt.compare(req.body.password,data.password,(err,admin)=>{
                if(err) throw err
                else{
                    if(admin==true){
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

router.post('/addproduct',async(req,res)=>{
    let data=new ProductModel({
        product_id:req.body.product_id,
        product_name:req.body.product_name,
        product_price:req.body.product_price,
        product_description:req.body.product_description,
        product_category:req.body.product_category,
        available_quantity:req.body.available_quantity,
        percentage_discount:req.body.percentage_discount,
        online_date:req.body.online_date,
    })

    data.save((err)=>{
        if(err) throw err
        else{
            res.json("added")
        }

    })
    
})
router.get('/getproduct',async(req,res)=>{
    ProductModel.find().then((data)=>{
        res.json(data)
    })
})
router.get('/getproduct/:category',async(req,res)=>{
    let category=req.params.category
    ProductModel.find({product_category:category}).then((data)=>{
        res.json(data)
    })
})
router.get('/deleteproduct/:id',async(req,res)=>{
    let id=req.params.id
    ProductModel.findByIdAndDelete(id).then((data)=>{
        res.json(data)
    })
})
router.get('/getuser',async(req,res)=>{
    UserModel.find().then((data)=>{
        res.json(data)
    })
})
router.post('/addtocart',async(req,res)=>{
    console.log("ok");
    res.json({message:"done"})
})


module.exports=router
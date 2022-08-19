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
                    if(admin){
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
            res.json({message:false})
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
        image:req.body.imageUrl,
        AuxUrl:req.body.AuxUrl,
        online_date:req.body.online_date,
    })

    data.save((err)=>{
        if(err) throw err
        else{
            res.json({message:"New Product Added"})
        }

    })
    
})

router.post('/editproduct/:product',async(req,res)=>{
    let product=req.params.product;
    console.log("ProductEditing",product);
    console.log("ProductEditing",req.body);
    ProductModel.findByIdAndUpdate(product,{$set:req.body}).then((data)=>{
        console.log("editProduct",data);
        res.json({message:"Product Edited"})
    })
})


router.get('/deleteproduct/:id',async(req,res)=>{
    let id=req.params.id
    ProductModel.findByIdAndDelete(id).then((data)=>{
        console.log("deleteProduct",data);
        res.json({message:"Product Deleted"})
    })
})
router.get('/deleteuser/:id',async(req,res)=>{
    let id=req.params.id
    UserModel.findByIdAndDelete(id).then((data)=>{
        console.log("deleteUser",data);
        res.json({message:"User Deleted"})
    })
})
router.get('/getuser',async(req,res)=>{
    UserModel.find().then((data)=>{
        res.json(data)
    })
})



module.exports=router
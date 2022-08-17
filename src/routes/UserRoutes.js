require('dotenv').config()
const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const session=require('express-session');
const passportLocalMongoose=require('passport-local-mongoose')
const jwt=require('jsonwebtoken')
const {UserModel, ProductModel, CartModel, PlaceOrderModel}=require('./../../config/connection')
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
            res.json(err)
        }
        else{
            passport.authenticate("local")(req,res,()=> {
                let token=Math.floor(1000 + Math.random() * 9000);
                let output=
                `<h2>CAR-CONNECT</h2>
                <p>Welcome to CAR_CONNECT</p>
                <h5>
                Dear ${req.body.username}:
                
                Your verification Code to verify the email address on your account</h5>
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
    if(req.isAuthenticated()){
        res.json('authenticated')
    }else{
        res.json('not auth')
    }
})
router.post('/authpass',(req,res)=>{
    // jwt.verify(req.body.key,'qwerty',(err,decoded)=>{
    //     if(err) throw err
    //     else{
    //         console.log(decoded);
    //         res.json({user:decoded})
    //     }
    // })
    res.json({user:"auth"})
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
router.get('/product/:id',(req,res)=>{
    let id=req.params.id;
    ProductModel.findById(id).then((data)=>{
        res.json(data)
    })
})
router.post('/addtocart',async(req,res)=>{
    CartModel.findOne({user:req.body.user}).then((data)=>{
        if(data==null){
            let data=new CartModel({
                user:req.body.user,
                products:req.body.cart
               })
               data.save((err)=>{
                if(err) throw err
                res.json({message:"done"})
            
               })

        }
        else{

            CartModel.updateOne({_id:data._id},{products:req.body.cart}).then(()=>{
                res.json({message:"done"})
                
            })
        }

    })
 
})
router.post('/deletecartproduct/:id',(req,res)=>{
    let id=req.params.id;
    CartModel.updateMany({user:id},{products:req.body}).then((data)=>{
        console.log(data);
        res.json({message:'done'})

    })
 

})
router.post('/deletewishproduct/:id',(req,res)=>{
    let id=req.params.id;
    CartModel.updateMany({user:id},{wishlist:req.body}).then((data)=>{
        res.json({message:'done'})
    })
 

})
router.delete('/deletecart/:user',(req,res)=>{
    let userR=req.params.user;
    CartModel.updateOne({user:userR},{products:[]}).then((data)=>{
        res.json({message:'done'})
    })

})

router.get('/details/:user',(req,res)=>{
    let user=req.params.user;
    UserModel.findOne({username:user}).then((data)=>{
        res.json(data)
    })
})
router.get('/getcart/:user',(req,res)=>{
    let userR=req.params.user;
    CartModel.findOne({user:userR}).then((data)=>{
        if(data==null){
            res.json({products:[]})
        }
        else{

            res.json(data)
        }
    })
})
router.post('/addtowish',(req,res)=>{
    CartModel.updateOne({user:req.body.user},{wishlist:req.body.wish}).then((data)=>{
        if(data.matchedCount==0){
            let data=new CartModel({
                user:req.body.user,
                wishlist:req.body.wish
               })
               data.save((err)=>{
                if(err) throw err
                res.json({message:"done"})
            
               })
        }
        // res.json({message:'done'})
    })
})


router.get('/getwishproducts/:user',(req,res)=>{
    let userR=req.params.user;
    CartModel.findOne({user:userR}).then((data)=>{
        res.json(data.wishlist)
    })
})
router.post('/placeorder/:user',(req,res)=>{
    let userR=req.params.user;
    let time=new Date(req.body.time)
    let data=new PlaceOrderModel({
        user:userR,
        products:req.body.cart,
        time:time

    })
    data.save((err)=>{
        if(err) throw err
        else{
            res.json({message:'done'})
        }
    })
})
router.get('/getplaceorder/:user',(req,res)=>{
    let userR=req.params.user;
    PlaceOrderModel.findOne({user:userR}).then((data)=>{
        res.json(data)
    })
})

module.exports=router
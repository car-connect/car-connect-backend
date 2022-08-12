require('dotenv').config()
const mongoose=require('mongoose')
const session=require('express-session');
const passportLocalMongoose=require('passport-local-mongoose')
const passport=require('passport')
const findOrCreate = require('mongoose-findorcreate')
const emailValidator=require('email-validator')
const url=process.env.MONGODB_URL
//database connection
mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},()=>{
    console.log(`Database Connected`);
})
//mongoose.set("useCreateIndex",true)


//schema 

const UserSchema=new mongoose.Schema({
    username:{
      type:String,
      trim:true,
      validate:{
        validator:emailValidator.validate,
        message:props=>`${props.value} is not a valid e-mail`
      }
    },
    password:{
      type:String,
      trim:true,
      minlength:8
    },
    name:{
      type:String,
      trim:true,
    },
    googleId:String,
    
    
 },
  
  {
  
    timestamps:true
   
  }

);
UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);

const AdminSchema=new mongoose.Schema({
  username:{
    type:String,
    trim:true
  },
  password:{
    type:String,
    trim:true
  }
})

const ProductSchema=new mongoose.Schema({
  product_id:String,
  product_name:String,
  product_price:String,
  product_description:String,
  product_category:String,
  available_quantity:String,
  percentage_discount:String,
  online_date:String,

})
const Cartschema=new mongoose.Schema({
  user:String,
  products:Array,
  Qty:Number

})

//models

const UserModel=mongoose.model('Users',UserSchema)

passport.use(UserModel.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

// passport.serializeUser(UserModel.serializeUser());
// passport.deserializeUser(UserModel.deserializeUser());

const AdminModel=mongoose.model('Admins',AdminSchema)

const ProductModel=mongoose.model('Products',ProductSchema)

const CartModel=mongoose.model('Cart',Cartschema)
module.exports={UserModel,AdminModel,ProductModel,CartModel}
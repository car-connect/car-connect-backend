require('dotenv').config()
const mongoose=require('mongoose')
const session=require('express-session');
const passportLocalMongoose=require('passport-local-mongoose')
const passport=require('passport')
const findOrCreate = require('mongoose-findorcreate')
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
    username:String,
    password:String,
    googleId:String
});
UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);



//models

const UserModel=mongoose.model('Users',UserSchema)

passport.use(UserModel.createStrategy());

// passport.serializeUser(function(user, cb) {
//     process.nextTick(function() {
//       cb(null, { id: user.id, username: user.username, name: user.name });
//     });
//   });
  
//   passport.deserializeUser(function(user, cb) {
//     process.nextTick(function() {
//       return cb(null, user);
//     });
//   });

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

module.exports={UserModel}
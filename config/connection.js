const mongoose=require('mongoose')
const url=process.env.MONGODB_URL
//database connection
mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},()=>{
    console.log(`Database Connected`);
})



//schema 

const UserSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String
})



//models

const UserModel=mongoose.model('Users',UserSchema)

module.exports={UserModel}
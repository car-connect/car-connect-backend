require('dotenv').config()
const express=require('express')
const app = new express()
const cors=require('cors')
const UserRouter=require('./src/routes/UserRoutes')
const port=process.env.PORT || 8000

 //middlewares
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())


 //routes
app.use('/user',UserRouter)

 //PORT
app.listen(port,()=>{
    console.log(`server connected at http://localhost:${port}`);
})
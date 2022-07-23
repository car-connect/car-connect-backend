require('dotenv').config();
const express=require('express');
const app = new express();
const cors=require('cors');
const UserRouter=require('./src/routes/UserRoutes');
const AdminRouter=require('./src/routes/AdminRoutes')
const session=require('express-session');
const passport=require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieParser=require('cookie-parser')
const jwt=require('jsonwebtoken')
const {UserModel}=require('./config/connection');
const port=process.env.PORT || 8000 ;

 //middlewares
app.use(cors({
    origin:'*',
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser())
app.use(session({
    secret:process.env.SESSION_SECRET || 'anything',
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    UserModel.findOrCreate({ googleId: profile.id ,username: profile.emails[0].value }, function (err, user) {
      return cb(err, user);
    });
  }
));
 //routes
app.use('/user',UserRouter);
app.use('/admin',AdminRouter)

app.get('/auth/google',
  passport.authenticate('google', { scope: ["profile","email","openid"] }));

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    //res.json("authenticated")
    let responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
    responseHTML = responseHTML.replace('%value%', JSON.stringify({
       token:jwt.sign(req.user.username+req.user.password,process.env.JWT_SECRET),
        user: req.user
    }));
    res.status(200).send(responseHTML);
  });

 //PORT
app.listen(port,()=>{
    console.log(`server connected at http://localhost:${port}`);
});
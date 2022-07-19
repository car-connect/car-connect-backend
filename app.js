require('dotenv').config();
const express=require('express');
const app = new express();
const cors=require('cors');
const UserRouter=require('./src/routes/UserRoutes');
const session=require('express-session');
const passport=require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {UserModel}=require('./config/connection');
const port=process.env.PORT || 8000 ;

 //middlewares
app.use(cors({
    origin:'http://localhost:4200',
    credentials:true
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_KEY,
    callbackURL: "http://localhost:8000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    UserModel.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
 //routes
app.use('/user',UserRouter);

app.get('/auth/google',
  passport.authenticate('google', { scope: ["profile"] }));

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.json("authenticated")
  });

 //PORT
app.listen(port,()=>{
    console.log(`server connected at http://localhost:${port}`);
});
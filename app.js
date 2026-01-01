if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require('express')
const app = express();

const mongoose = require('mongoose');
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo').default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const user=require("./models/user.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");





app.set("views",path.join(__dirname,"views")  );
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const store=MongoStore.create({
  mongoUrl:process.env.ATLAS_URL,
  crypto:{
    secret:process.env.SECRETE,
  },
  touchAfter:24*3600,
})


const sessionOptions={
    store,
    secret:process.env.SECRETE,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        httpOnly:true,
        maxAge:7*24*60*60*1000,
    }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use("/listing",listingRouter);
app.use("/listing/:id/review",reviewRouter);



main()
.then((req,res)=>{
    console.log("connected to DB");
    
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.ATLAS_URL);
}








//signup
app.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
});

app.post("/signup",async(req,res)=>{
   try{
     let{username,email,password}=req.body;
    const newUser=new user({
        email,
        username
    });
    const registerUser=await user.register(newUser,password);
    req.login(registerUser,(err)=>{
        if(err){
            next(err);
        }
         req.flash("success","Welcome to Wanderlust!!");
    res.redirect("/listing");
    })
   
   }
   catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
   }

})


//login 
app.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});

app.post("/login",passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),(req,res)=>{
    req.flash("success","welcome again!");
    res.redirect("/listing");
    
})


//logout
app.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listing");
    })
})















app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"))
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.render("error.ejs",{message});

})



app.listen(8080, () => {
  console.log(` app listening on port 8080`)
})

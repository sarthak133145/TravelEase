const express=require("express");
const router=express.Router();
const listing=require("../models/listings.js");
const wrapAsync=require("../utils/wrapasync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body.listing)
    if(error){
        throw new ExpressError(404,error.message);
    }
    else{
        next();
    }
}


//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
     if(!req.isAuthenticated()){
        req.flash("error","you must be logged in!")
        res.redirect("/login");
    }
    let{id}=req.params;
  const editListing= await listing.findById(id);
   res.render("listing/edit.ejs",{editListing});
}))


router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let {title,description,location,price,country}=req.body;
      await listing.findByIdAndUpdate(id,{title,description,location,price,country});
       req.flash("success","Listing Updated successfully!");
      res.redirect(`/listing/${id}`);
}))


//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
     if(!req.isAuthenticated()){
        req.flash("error","you must be logged in!")
        res.redirect("/login");
    }
    let{id}=req.params;
   await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
   res.redirect("/listing");
}));




//new route
router.get("/new",(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in!")
        res.redirect("/login");
    }
    res.render("listing/new.ejs");
});

router.post("/",upload.single("image"),validateListing,wrapAsync(async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename

    let {title,description,location,price,country}=req.body;
    let data=new listing({
        title,description,location,price,country
    });
    
    data.owner=req.user._id;
    data.image={url,filename};
   await data.save();
   req.flash("success","new listing added!");
   res.redirect("/listing");
   
}))


//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
 const showListing= await listing.findById(id).populate("owner").populate({
    path:"reviews",
    populate:{
        path:"author"
    }
 });
 if(!showListing){
req.flash("error","listing you requested for does not exist!!");
res.redirect("/listing");
 }
 
 res.render("listing/show.ejs",{showListing})

}))

//index route
router.get("/",wrapAsync(async(req,res)=>{
   const allListing= await listing.find();
   res.render("listing/index.ejs",{allListing});
    
}))







module.exports=router;
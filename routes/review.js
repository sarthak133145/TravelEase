const express=require("express");
const router=express.Router({ mergeParams: true });
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapasync.js");
const {reviewSchema}=require("../schema.js");
const listing=require("../models/listings.js");
const review=require("../models/review.js");




const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(404,error);
    }
    else{
        next();
    }
}


//review post route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let{id}=req.params;
 let reviewId=  await listing.findById(id);
 let{comment,rating}=req.body;
 const newReview=new review({
    comment,
    rating
 });
 newReview.author=req.user._id;

 reviewId.reviews.push(newReview);
await reviewId.save();
 await newReview.save();
  req.flash("success","new Review created!");
 res.redirect(`/listing/${id}`);
}))


//review delete route
router.delete("/:reviewId",async(req,res)=>{
    let {id,reviewId}=req.params;
   await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await review.findByIdAndDelete(reviewId);
   res.redirect(`/listing/${id}`);
})


module.exports=router;
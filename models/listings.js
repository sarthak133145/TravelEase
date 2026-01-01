const mongoose=require("mongoose");
const review = require("./review.js");
const user=require("./user.js");
const {Schema}=mongoose;

const listingSchema=new Schema({
    title:String,
    description:String,
    price:Number,
    location:String,
    country:String,
    image:{
        url:String,
        filename:String,
    },
    reviews:[{
         type: Schema.Types.ObjectId,
          ref: 'review'
    }],
    owner:{
        type: Schema.Types.ObjectId,
          ref: 'user'
    }
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length){
       await review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const listing=mongoose.model("listing",listingSchema);



module.exports=listing;
const mongoose=require("mongoose");
const {Schema}=mongoose;
const passportLocalMongoose=require("passport-local-mongoose").default;

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
});
userSchema.plugin(passportLocalMongoose);

const user=mongoose.model("user",userSchema);
module.exports=user;
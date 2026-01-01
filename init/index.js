const mongoose = require('mongoose');
const sampleListings=require("./data.js");
const listing=require("../models/listings.js");

main()
.then((req,res)=>{
    console.log("connected to DB");
    
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const initDB=async () => {
   await listing.deleteMany({});
   await listing.insertMany(sampleListings);


    
}
initDB();
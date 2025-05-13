const mongoose = require('mongoose');
const mongouri = "mongodb://localhost:27017/inotebook"

const connecttomongo = async() => {
   try{
     await mongoose.connect(mongouri) ; 
     console.log("connected to MongoDB");
   }
   catch(error) 
   {
    console.error('error connecting to mongodb',error) ;
   }
}

module.exports=connecttomongo;
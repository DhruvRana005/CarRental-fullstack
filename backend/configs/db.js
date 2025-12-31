import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/4wheeler-project`)
    } catch (error){
        console.log(error.message);
    }
}

export default connectDB;
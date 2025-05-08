import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`) //Mongoose gives us a return object and we can hold the response in a variable(with a random name)
        console.log(`\n MongoDb connected !! DB HOST: ${connectionInstance.connection.host}`);
        
    }catch(error){
        console.log("MONGODB connection error ", error);
        process.exit(1) // read the process in node.

    }


}

export default connectDB
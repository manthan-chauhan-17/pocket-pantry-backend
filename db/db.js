import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const dbConnectingInstance= await mongoose.connect(process.env.MONGO_URI);

        console.log(`DB connected on host : ${dbConnectingInstance.connection.host}`);
        
    } catch (error) {
        console.log("ERROR connecting MongoDB : " , error);
        
    }
}

export default connectDB;
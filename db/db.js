import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbConnectingInstance = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `✅ DB connected successfully! Host: ${dbConnectingInstance.connection.host}`
    );
  } catch (error) {
    console.log("❌ ERROR connecting to MongoDB:", error);
  }
};

export default connectDB;

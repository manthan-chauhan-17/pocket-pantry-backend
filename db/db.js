import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let mongo_uri =
      process.env.ENV == "dev"
        ? process.env.MONGO_URI_LOCAL
        : process.env.MONGO_URI;
    const dbConnectingInstance = await mongoose.connect(mongo_uri);

    console.log(
      `✅ DB connected successfully! Host: ${dbConnectingInstance.connection.host}`
    );
  } catch (error) {
    console.log("❌ ERROR connecting to MongoDB:", error);
  }
};

export default connectDB;

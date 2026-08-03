import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB Connected");
  } catch (err) {
    console.log("Database Error", err);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const d = await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "daily_expanse",
    });
    console.log("Database connected successfully", d?.connection?.name);
  } catch (error) {
    console.error("db connection error :-", error);
  }
};

export default connectDB;

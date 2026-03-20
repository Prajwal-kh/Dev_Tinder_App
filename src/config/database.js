import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Connection established to the database");
    } catch (error) {
        console.log("Error while connecting to the database " + error);
    }
};

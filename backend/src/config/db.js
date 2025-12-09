import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        isConnected = false;
        // process.exit(1); // Do not exit, keep server running for diagnostics
    }
};

export { isConnected };
export default connectDB;

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config('../.env');
const connectDatabase = async()=>{
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`Connected to MongoDB: ${connectInstance.connection.host}`);
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
        process.exit(1);
    }
}
export default connectDatabase;
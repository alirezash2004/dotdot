import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI);
        console.log('Connected to database'['bgCyan']);
    } catch (error) {
        console.log(`Error: ${err}`['bgRed'])
    }
}

export default connectToMongoDB;
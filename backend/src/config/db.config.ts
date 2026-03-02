import mongoose from "mongoose";


 export async function connectDB()
{
    try {
        await mongoose.connect((process.env.MONGODB_URI)as string)
        console.log("DataBase Connected SuccessFully...✅✅✅✅✅✅✅✅✅✅✅");
        
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}


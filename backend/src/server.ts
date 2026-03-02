import express, { type Application, type Request, type Response } from "express";
import dotenv from 'dotenv';
import { connectDB } from "./config/db.config";
import UserRoute from "./routes/user.routes";
import cors from "cors"
import ProjectRouter from "./routes/project.routes";
import TaskRouter from "./routes/task.routes";




dotenv.config();
connectDB();

const app: Application = express();
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 


console.log("Pata nahi kyon nahi ho raha hai");

app.use('/',UserRoute);
app.use('/',ProjectRouter);
app.use('/',TaskRouter);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
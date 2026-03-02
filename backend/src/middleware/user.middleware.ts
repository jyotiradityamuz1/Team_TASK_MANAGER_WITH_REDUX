import  express, { Application, Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';    
import Users from '../models/User';
dotenv.config();
const app:Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const auth = async (req:Request, res:Response, next:NextFunction) =>{
    try{
        const bearerHeader = req.headers['authorization'];
        if(typeof bearerHeader !== "undefined")
        {
            const bearerToken = bearerHeader.split(' '); //kyonki ye array return krta h
            const token = bearerToken[1];
             //data 2n index pr h, idhar 0 pr 'Bearer' and 1 pr token h
            const user:string | jwt.JwtPayload  = jwt.verify(token, (process.env.JWT_SECRET) as string);
            (req as unknown as any).token = user;
            console.log("hello");
            
            next();
        }
        else
        {
            return res.status(403).json({message: "Authorization token missing"});
        }
    }
    catch(error)
    {
        return res.status(403).json({message: "Invalid token"});  
    }
};


async function finduserbytoken(req:Request,res:Response,next:NextFunction)
{
    try {
        const user = await Users.findById((req as unknown as any).token.userId);
        if(!user)
        {
            return res.status(404).json({message: "User not found"});
        }
        (req as unknown as any).user = user;
        next();
    } catch (error:any) {
        return res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}


export {auth, finduserbytoken};
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv, { decrypt } from 'dotenv';
import Users from '../models/User';
import { auth, finduserbytoken } from '../middleware/user.middleware';

dotenv.config();
const UserRoute = Router();
UserRoute.post("/registerUser", async (req: Request, res: Response) => {
    try {
        const userName = req.body.userName;
        const email = req.body.email;
        const password = req.body.password;
        const existingUser = await Users.findOne({ $or: [{ email }, { userName }] });
        if (existingUser) {
            return res.status(404).json({ "message": "User Already Exist" });
        }
        const saltRounds = parseInt((process.env.SALT_ROUNDS) as string);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new Users({
            userName,
            email,
            password: hashedPassword
        })
        const saveUser = await newUser.save();
        return res.status(201).json({ message: "User Register sucssesfully ", data: saveUser });

    } catch (error) {
        return res.status(500).json({ message: `error hai${error}` });
    }

});

UserRoute.post('/login', async (req: Request, res: Response) => {
    try {
        console.log("Ab hum login ke andar hai");

        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }
        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ userId: user._id }, (process.env.JWT_SECRET) as string, { expiresIn: '24h' });
        req.headers['authorization'] = `Bearer ${token}`;
        console.log(token);

        res.status(200).json({ token, user });
    } catch (error: any) {
        return res.status(500).json({ "message": error });
    }

})


UserRoute.get('/getUser', auth, finduserbytoken, async (req: Request, res: Response) => {
    try {
        const user = await (req as any).user;


        console.log(user);
        res.status(200).json({ data: user });
    } catch (error) {
        return res.status(500).json({ "message": error });
    }
})

UserRoute.post('/change-password', auth, finduserbytoken, async (req: Request, res: Response) => {
    try {
        const user = await (req as any).user;
        console.log(user);

        const password = req.body.priviousPassword;
        const newPassword = req.body.newPassword;
        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const saltRounds = parseInt((process.env.SALT_ROUNDS) as string);
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        const updatedUser = await user.save();

        return res.status(200).json({ message: "password is updated Successfully", updatedUser });
    } catch (error) {
        return res.status(500).json({ "message": error });
    }
})


UserRoute.get('/getAllUser', auth, async (req: Request, res: Response) => {
    try {
        const allUser = await Users.find();
        res.status(200).json({ data: allUser });
    } catch (error) {
        return res.status(500).json({ "message": error });
    }
})


UserRoute.get('/SearchUser', auth, async (req: Request, res: Response) => {
    try {
        const search = req.query.search;
        const SearchedUser = await Users.find({
            userName: {
                $regex: `^${search}`,
                $options: "i"
            }
        });
        res.status(200).json({ data: SearchedUser });
    } catch (error) {
        return res.status(500).json({ "message": error });
    }
})



UserRoute.post("/get-otp",  async(req:Request,res:Response)=>{
    try {
        const email = req.body.email;
        const isFound = await Users.findOne({email});
        if(!isFound)
        {
            return res.status(200).json({"message" :"Email Not Found"});
        }
        const otp = (Math.floor(1000 + Math.random() * 9000)).toString();
        console.log(otp)
        return res.status(200).json({ otp });
        
    } catch (error) {
       return res.status(500).json({"message":error})
    }
})



UserRoute.post("/create-password",  async(req:Request,res:Response)=>{
    try {
        const email = req.body.email;
        const newPassword = req.body.newPassword;
        const isFound = await Users.findOne({email});
        if(!isFound)
        {
            return res.status(200).json({"message" :"Email Not Found"});
        }
        const SALT_ROUNDS =  parseInt((process.env.SALT_ROUNDS) as string); 
        const hashedPassword = await bcrypt.hash(newPassword,SALT_ROUNDS);
        isFound.password = hashedPassword;
        const AfterUpdate = await isFound.save();
        
        return res.status(200).json({ AfterUpdate });
        
    } catch (error) {
       return res.status(500).json({"message":error})
    }
})

export default UserRoute;
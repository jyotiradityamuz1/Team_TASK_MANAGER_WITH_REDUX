import express from 'express';
import { Router, Request, Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import User from '../models/User';
import dotenv from 'dotenv';
dotenv.config();
const TaskRouter: Router = express.Router();

TaskRouter.post('/createTask', async (req: Request, res: Response) => {
    try {
        const { title, projectId, assignedToUserId, assignedBy } = req.body;

        if (!title && !projectId && !assignedToUserId && !assignedBy) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        const assignedToUser = await User.findById(assignedToUserId);
        if (!assignedToUser) {
            return res.status(404).json({ message: "Assigned user not found" });
        }
        console.log(title, projectId, assignedToUserId, assignedBy);

        const newTask = new Task({
            title,
            project: projectId,
            assignedTo: assignedToUserId,
            assignedBy: assignedBy
        });
        await newTask.save();
        return res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});

TaskRouter.get('/getAllTaskByProject', async (req: Request, res: Response) => {
    try {
        const { objectId } = req.query;
        if (!objectId) {
            return res.status(400).json({message:"ObjectId is required"});

        }
        const tasks = await Task.find({assignedTo:objectId}).populate("project").populate("assignedBy");
        return res.status(200).json({tasks});
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
})


TaskRouter.put('/updateTaskStatus', async (req: Request, res: Response) => {
    try {
        const { taskId } = req.query;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }  
        if(status === "in-progress")
        {
           task.status = "done"; 
        }
        else{
            task.status ="in-progress";
        }
         
        const UpdatedTask = await task.save();    
        return res.status(200).json({ message: "Task status updated successfully", UpdatedTask});  
    }   catch (error) {   
        return res.status(500).json({ message: "Internal Server Error", error });   
    }   
}); 

export default TaskRouter;
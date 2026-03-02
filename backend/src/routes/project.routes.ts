import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import Project from '../models/Project';
import { auth, finduserbytoken } from '../middleware/user.middleware';

dotenv.config();
const ProjectRouter = Router();

ProjectRouter.post('/creatProject', async (req: Request, res: Response) => {
    try {

        const { projectName, description, members, createdBy } = req.body;
        console.log(createdBy)

        if (projectName && description && members && createdBy) {
            const newProject = new Project({
                projectName,
                description,
                members,
                createdBy,
            });
            await newProject.save();
            return res.status(201).json({ message: "Project created successfully", project: newProject });
        }
        else {
            return res.status(400).json({ message: "All fields are required" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });

    }
})



ProjectRouter.get('/compeleted-project', async (req: Request, res: Response) => {
    try {
        const projects = await Project.find({ status: "completed" }).populate("members");
        return res.status(200).json({ projects });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});


ProjectRouter.post('/project-status', auth, async (req: Request, res: Response) => {
    try {
        const id = req.body.projectId;
        const project = await Project.findById({ _id: id });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        project.status = "completed";
        const updatedProject = await project.save();
        return res.status(200).json({ message: "Project status updated", updatedProject });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});

ProjectRouter.get('/ProjectMember', async (req: Request, res: Response) => {
    try {

        const { ProjectID } = req.query;
        console.log(ProjectID);

        const projectDetails = await Project.findById(ProjectID).populate("members");
        console.log(projectDetails);

        return res.status(200).json({ projectDetails });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
})


ProjectRouter.put('/delete-member', auth, finduserbytoken, async (req: Request, res: Response) => {
    try {
        const user = await (req as any).user;
        console.log("YE hai", user._id);

        const Todelete = req.body.userId;
        console.log("ISko hi delete karna hai", Todelete);

        const ProjectID = req.body.projectId;
        console.log("YE project id hai", ProjectID);

        const project = await Project.findById(ProjectID);
        if (!project) {
            return res.status(200).json({ Message: "Project not found" });

        }
        if (project.createdBy.toString() !== user._id.toString()) {
            return res.status(200).json({ Message: "You are not Authorized to do So" });
        }


        const updatedProject = await Project.findByIdAndUpdate(
            ProjectID,
            { $pull: { members: Todelete } }
        );


        return res.status(200).json({ updatedProject });



    } catch (error) {
        return res.status(500).json({ error });
    }
})


ProjectRouter.put('/add-member', auth, finduserbytoken, async (req: Request, res: Response) => {
    try {
        const user = await (req as any).user;
        console.log("YE hai", user._id);

        const members = req.body.members;

        const ProjectID = req.body.projectId;
        console.log("YE project id hai", ProjectID);

        const project = await Project.findById(ProjectID);
        if (!project) {
            return res.status(200).json({ Message: "Project not found" });

        }
        if (project.createdBy.toString() !== user._id.toString()) {
            return res.status(200).json({ Message: "You are not Authorized to do So" });
        }
        const updatedProject = await Project.findByIdAndUpdate(
            ProjectID,
            { $addToSet: { members: { $each: members } } }
        );


        return res.status(200).json({ updatedProject });



    } catch (error) {
        return res.status(500).json({ error });
    }
})


ProjectRouter.post('/getUserProject', async (req: Request, res: Response) => {
    try {


        const userId = req.body.UserId as string;
        const status = "on-going"

        if (!userId) {
            return res.status(400).json({ message: "UserId is required" });
        }

        // const projects = await Project.find({ members: userId, status: status }).populate('members');
        const projects = await Project.find({
            $or: [
                {
                    $and: [
                        { createdBy: userId },
                        { status: status }
                    ]
                },
                {
                    members: userId,
                    status: status
                }
            ]
    }).populate('members');
console.log("Yahi project hai", projects);

return res.status(200).json({ projects });
    } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
}
});

export default ProjectRouter;
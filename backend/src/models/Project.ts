import mongoose from "mongoose";
import Users from "./User";

const ProjectSchema = new mongoose.Schema({
    projectName: {
        unique: true,
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
     status: {
        type: String,
        enum: ["on-going", "completed"],
        default:"on-going",
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:  Users,
            required: true
        }
    ],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Users,
        required:true
    }
})

const Project = mongoose.model("Projects", ProjectSchema);
export default Project;
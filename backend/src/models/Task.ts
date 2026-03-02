import mongoose from "mongoose";
import Project from "./Project";
import User from "./User";
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["in-progress", "done"],
        default:"in-progress",
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Project,
        require:true
    },
    assignedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        require:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        require:true
    }
})

const Task = mongoose.model("Tasks", TaskSchema);
export default Task;

import mongoose from "mongoose";

const taskCompletionSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DailyTask",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    submissionText: {
        type: String,
        default: "",
    },
    submissionMediaURL: {
        type: String,
        default: "",
    },
    submissionType: {
        type: String,
        enum: ["text", "photo", "video", "none"],
        default: "none",
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index to ensure one completion per user per task
taskCompletionSchema.index({ taskId: 1, userId: 1 }, { unique: true });

const TaskCompletion = mongoose.model("TaskCompletion", taskCompletionSchema);

export default TaskCompletion;

import mongoose from "mongoose";

const dailyTaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    submissionType: {
        type: String,
        enum: ["text", "photo", "video", "any"],
        default: "text",
    },
    category: {
        type: String,
        enum: ["communication", "fun", "romantic", "creative", "thoughtful"],
        default: "fun",
    },
    date: {
        type: Date,
        required: true,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for efficient daily queries
dailyTaskSchema.index({ date: 1 });

const DailyTask = mongoose.model("DailyTask", dailyTaskSchema);

export default DailyTask;

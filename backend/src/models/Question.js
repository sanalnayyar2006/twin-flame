import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["truth", "dare"],
        required: true,
    },
    category: {
        type: String,
        enum: ["fun", "romantic", "deep", "spicy"],
        default: "fun",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;

import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    mediaURL: {
        type: String,
        required: true
    },
    mediaType: {
        type: String,
        enum: ["photo", "video"],
        default: "photo"
    },
    category: {
        type: String,
        enum: ["food", "outfit", "selfie", "us", "random", "task"],
        default: "random"
    },
    caption: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
photoSchema.index({ userId: 1, createdAt: -1 });
photoSchema.index({ partnerId: 1, createdAt: -1 });
photoSchema.index({ category: 1 });

export default mongoose.model("Photo", photoSchema);

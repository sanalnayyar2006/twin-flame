import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
        default: "",
    },
    name: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        enum: ["male", "female", "other", ""],
        default: "",
    },
    age: {
        type: Number,
        min: 13,
        max: 120,
    },
    photoURL: {
        type: String,
        default: "",
    },
    profileComplete: {
        type: Boolean,
        default: false,
    },
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    partnerCode: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined to not conflict
    },
    truthDareTurn: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

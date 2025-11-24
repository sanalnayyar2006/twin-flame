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
    photoURL: {
        type: String,
        default: "",
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

export default User;

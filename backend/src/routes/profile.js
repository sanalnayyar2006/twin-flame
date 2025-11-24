import express from "express";
import { verifyToken } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// @route   GET /api/profile
// @desc    Get current user profile
// @access  Private
router.get("/", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.user.uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            name: user.name,
            gender: user.gender,
            age: user.age,
            photoURL: user.photoURL,
            profileComplete: user.profileComplete,
            email: user.email,
        });
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put("/", verifyToken, async (req, res) => {
    try {
        const { name, gender, age, photoURL } = req.body;

        let user = await User.findOne({ uid: req.user.uid });

        if (!user) {
            // Auto-create user if missing
            user = await User.create({
                uid: req.user.uid,
                email: req.user.email,
                displayName: req.user.name || "",
            });
        }

        // Update fields
        if (name !== undefined) user.name = name;
        if (gender !== undefined) user.gender = gender;
        if (age !== undefined) user.age = age;
        if (photoURL !== undefined) user.photoURL = photoURL;

        // Mark profile as complete if all required fields are filled
        if (user.name && user.gender && user.age) {
            user.profileComplete = true;
        }

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                name: user.name,
                gender: user.gender,
                age: user.age,
                photoURL: user.photoURL,
                profileComplete: user.profileComplete,
            },
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

import express from "express";
import { verifyToken } from "../middleware/auth.js";
import User from "../models/User.js";
import crypto from "crypto";

const router = express.Router();

// Generate a random 5-character code
const generateCode = () => {
    return crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 5);
};

// @route   GET /api/user/code
// @desc    Get or create a partner code for the current user
// @access  Private
router.get("/code", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.user.uid });

        if (!user) return res.status(404).json({ message: "User not found" });

        // If user already has a code, return it
        if (user.partnerCode) {
            return res.json({ code: user.partnerCode });
        }

        // Generate a unique code
        let code;
        let isUnique = false;
        while (!isUnique) {
            code = generateCode();
            const existing = await User.findOne({ partnerCode: code });
            if (!existing) isUnique = true;
        }

        user.partnerCode = code;
        await user.save();

        res.json({ code });
    } catch (error) {
        console.error("Get Code Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/user/link
// @desc    Link account with a partner using their code
// @access  Private
router.post("/link", verifyToken, async (req, res) => {
    const { partnerCode } = req.body;

    if (!partnerCode) {
        return res.status(400).json({ message: "Partner code is required" });
    }

    try {
        const currentUser = await User.findOne({ uid: req.user.uid });
        if (!currentUser) return res.status(404).json({ message: "User not found" });

        if (currentUser.partnerId) {
            return res.status(400).json({ message: "You are already linked to a partner" });
        }

        // Find partner by code
        const partnerUser = await User.findOne({ partnerCode: partnerCode.toUpperCase() });

        if (!partnerUser) {
            return res.status(404).json({ message: "Invalid partner code" });
        }

        if (partnerUser.uid === currentUser.uid) {
            return res.status(400).json({ message: "You cannot link with yourself" });
        }

        if (partnerUser.partnerId) {
            return res.status(400).json({ message: "This user is already linked to someone else" });
        }

        // Link both users
        currentUser.partnerId = partnerUser._id;
        partnerUser.partnerId = currentUser._id;

        await currentUser.save();
        await partnerUser.save();

        res.json({
            message: "Successfully linked!",
            partner: {
                name: partnerUser.displayName,
                email: partnerUser.email
            }
        });

    } catch (error) {
        console.error("Link Partner Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Question from "../models/Question.js";

const router = express.Router();

// @route   GET /api/truthdare/random
// @desc    Get a random truth or dare question
// @access  Private
router.get("/random", verifyToken, async (req, res) => {
    try {
        const { type } = req.query; // 'truth' or 'dare'

        if (!type || !["truth", "dare"].includes(type)) {
            return res.status(400).json({ message: "Invalid type. Must be 'truth' or 'dare'." });
        }

        // Get a random question of the specified type
        const count = await Question.countDocuments({ type });

        if (count === 0) {
            // Fallback if no questions exist in DB
            const fallback = type === "truth"
                ? "What is your favorite memory of us?"
                : "Give your partner a 1-minute massage.";
            return res.json({ text: fallback, category: "fun" });
        }

        const random = Math.floor(Math.random() * count);
        const question = await Question.findOne({ type }).skip(random);

        res.json(question);
    } catch (error) {
        console.error("Truth/Dare Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/truthdare/seed
// @desc    Seed the database with initial questions (Dev only)
// @access  Private
router.post("/seed", verifyToken, async (req, res) => {
    try {
        const count = await Question.countDocuments();
        if (count > 0) return res.status(400).json({ message: "Questions already seeded" });

        const questions = [
            { text: "What is your biggest fear?", type: "truth", category: "deep" },
            { text: "What was your first impression of me?", type: "truth", category: "romantic" },
            { text: "Sing a song for me.", type: "dare", category: "fun" },
            { text: "Do 10 pushups.", type: "dare", category: "fun" },
            { text: "Tell me a secret you've never told anyone.", type: "truth", category: "deep" },
            { text: "Let me check your phone gallery for 1 minute.", type: "dare", category: "spicy" },
        ];

        await Question.insertMany(questions);
        res.json({ message: "Database seeded successfully!" });
    } catch (error) {
        console.error("Seed Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

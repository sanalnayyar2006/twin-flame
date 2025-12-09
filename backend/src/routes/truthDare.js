import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Question from "../models/Question.js";

const router = express.Router();

// @route   GET /api/truthdare/questions
// @desc    Get all questions with pagination, filtering, sorting, and search
// @access  Private
router.get("/questions", verifyToken, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            type,
            category,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = {};
        if (type && ['truth', 'dare'].includes(type)) {
            filter.type = type;
        }
        if (category && ['fun', 'romantic', 'deep', 'spicy'].includes(category)) {
            filter.category = category;
        }
        if (search) {
            filter.text = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute queries
        const [questions, total] = await Promise.all([
            Question.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNum),
            Question.countDocuments(filter)
        ]);

        res.json({
            questions,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error("Questions List Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

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
        const questions = [
            { text: "What is your biggest fear?", type: "truth", category: "deep" },
            { text: "What was your first impression of me?", type: "truth", category: "romantic" },
            { text: "Sing a song for me.", type: "dare", category: "fun" },
            { text: "Do 10 pushups.", type: "dare", category: "fun" },
            { text: "Tell me a secret you've never told anyone.", type: "truth", category: "deep" },
            { text: "Let me check your phone gallery for 1 minute.", type: "dare", category: "spicy" },
            // New Deep Questions
            { text: "What is one thing you wish I understood better about you?", type: "truth", category: "deep" },
            { text: "When was the last time you truly missed me, and what triggered it?", type: "truth", category: "deep" },
            { text: "What is a small habit of mine that secretly makes you smile?", type: "truth", category: "romantic" },
            { text: "What is one insecurity you have about our relationship that you've never said out loud?", type: "truth", category: "deep" },
            { text: "What moment with me do you replay in your head the most?", type: "truth", category: "romantic" },
            { text: "If distance disappeared tomorrow, what's the first thing you'd want to do together?", type: "truth", category: "romantic" },
            // Generated Additional Questions
            { text: "What is a song that always reminds you of me, and why?", type: "truth", category: "romantic" },
            { text: "What is your favorite non-physical attribute of mine?", type: "truth", category: "romantic" },
            { text: "If we could travel anywhere right now, where would we go?", type: "truth", category: "fun" },
            { text: "What is one promise you want to make to me for our future?", type: "truth", category: "deep" },
            { text: "Describe your perfect date night with me.", type: "truth", category: "romantic" },
            { text: "Send me a voice note saying 'I love you' in a funny voice.", type: "dare", category: "fun" },
            { text: "Do your best impression of me for 30 seconds.", type: "dare", category: "fun" },
            { text: "Send me the 5th photo in your camera roll (no cheating!).", type: "dare", category: "spicy" },
            { text: "Write my name on your arm and send a picture.", type: "dare", category: "romantic" },
            { text: "Record yourself singing the chorus of our favorite song.", type: "dare", category: "fun" },
        ];

        // Upsert operations
        const ops = questions.map(q => ({
            updateOne: {
                filter: { text: q.text },
                update: { $set: q },
                upsert: true
            }
        }));

        await Question.bulkWrite(ops);
        res.json({ message: "Database seeded/updated successfully!" });
    } catch (error) {
        console.error("Seed Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   GET /api/truthdare/status
// @desc    Check whose turn it is
// @access  Private
router.get("/status", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.user.uid });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Default to true if undefined (for existing users)
        const isTurn = user.truthDareTurn !== false;
        res.json({ isTurn });
    } catch (error) {
        console.error("Status Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   POST /api/truthdare/complete
// @desc    Mark turn as complete and pass to partner
// @access  Private
router.post("/complete", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.user.uid });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Set my turn to false
        user.truthDareTurn = false;
        await user.save();

        // Set partner's turn to true
        if (user.partnerId) {
            await User.findByIdAndUpdate(user.partnerId, { truthDareTurn: true });
        }

        res.json({ message: "Turn completed", isTurn: false });
    } catch (error) {
        console.error("Complete Turn Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   PUT /api/truthdare/questions/:id
// @desc    Update a question
// @access  Private
router.put("/questions/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { text, type, category } = req.body;

        // Validate input
        if (!text || !type || !category) {
            return res.status(400).json({ message: "Text, type, and category are required" });
        }

        if (!['truth', 'dare'].includes(type)) {
            return res.status(400).json({ message: "Type must be 'truth' or 'dare'" });
        }

        if (!['fun', 'romantic', 'deep', 'spicy'].includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }

        const question = await Question.findByIdAndUpdate(
            id,
            { text, type, category },
            { new: true, runValidators: true }
        );

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({ message: "Question updated successfully", question });
    } catch (error) {
        console.error("Update Question Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   DELETE /api/truthdare/questions/:id
// @desc    Delete a question
// @access  Private
router.delete("/questions/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findByIdAndDelete(id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({ message: "Question deleted successfully", question });
    } catch (error) {
        console.error("Delete Question Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

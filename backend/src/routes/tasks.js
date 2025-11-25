import express from "express";
import { verifyToken } from "../middleware/auth.js";
import User from "../models/User.js";
import DailyTask from "../models/DailyTask.js";
import TaskCompletion from "../models/TaskCompletion.js";

const router = express.Router();

// @route   GET /api/tasks/today
// @desc    Get today's task with completion status for both partners
// @access  Private
router.get("/today", verifyToken, async (req, res) => {
    try {
        const currentUser = await User.findOne({ uid: req.user.uid });

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get today's date (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find today's task
        let task = await DailyTask.findOne({ date: today });

        // If no task exists for today, create one from available tasks
        if (!task) {
            const allTasks = await DailyTask.find().sort({ date: -1 }).limit(1);

            if (allTasks.length === 0) {
                // No tasks in database - return default task
                return res.json({
                    task: {
                        description: "Send each other a voice note saying what you love about them ❤️",
                        category: "communication",
                    },
                    currentUserCompleted: false,
                    partnerCompleted: false,
                });
            }

            // Get a random task description and create new task for today
            const randomTask = await DailyTask.aggregate([{ $sample: { size: 1 } }]);
            task = await DailyTask.create({
                description: randomTask[0].description,
                category: randomTask[0].category,
                date: today,
            });
        }

        // Check completion status
        const currentUserCompletion = await TaskCompletion.findOne({
            taskId: task._id,
            userId: currentUser._id,
        });

        let partnerCompletion = null;
        if (currentUser.partnerId) {
            partnerCompletion = await TaskCompletion.findOne({
                taskId: task._id,
                userId: currentUser.partnerId,
            });
        }

        res.json({
            task: {
                _id: task._id,
                description: task.description,
                category: task.category,
                submissionType: task.submissionType,
                date: task.date,
            },
            currentUserCompleted: !!currentUserCompletion,
            partnerCompleted: !!partnerCompletion,
            currentUserSubmission: currentUserCompletion ? {
                text: currentUserCompletion.submissionText,
                mediaURL: currentUserCompletion.submissionMediaURL,
                type: currentUserCompletion.submissionType,
            } : null,
            partnerSubmission: partnerCompletion ? {
                text: partnerCompletion.submissionText,
                mediaURL: partnerCompletion.submissionMediaURL,
                type: partnerCompletion.submissionType,
            } : null,
        });
    } catch (error) {
        console.error("Get Today's Task Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/tasks/complete
// @desc    Mark task as complete for current user
// @access  Private
router.post("/complete", verifyToken, async (req, res) => {
    try {
        const { taskId, submissionText, submissionMediaURL, submissionType } = req.body;

        if (!taskId) {
            return res.status(400).json({ message: "Task ID is required" });
        }

        const currentUser = await User.findOne({ uid: req.user.uid });

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const task = await DailyTask.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Create or update completion with submission data
        const completion = await TaskCompletion.findOneAndUpdate(
            { taskId: task._id, userId: currentUser._id },
            {
                completedAt: new Date(),
                submissionText: submissionText || "",
                submissionMediaURL: submissionMediaURL || "",
                submissionType: submissionType || "none",
            },
            { upsert: true, new: true }
        );

        // Check if partner also completed
        let bothCompleted = false;
        if (currentUser.partnerId) {
            const partnerCompletion = await TaskCompletion.findOne({
                taskId: task._id,
                userId: currentUser.partnerId,
            });
            bothCompleted = !!partnerCompletion;
        }

        res.json({
            message: "Task marked as complete",
            completion,
            bothCompleted,
        });
    } catch (error) {
        console.error("Complete Task Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/tasks/seed
// @desc    Seed database with initial tasks (dev only)
// @access  Private
router.post("/seed", verifyToken, async (req, res) => {
    try {
        const tasks = [
            { description: "Send each other a voice note saying what you love about them ❤️", category: "communication", submissionType: "video" },
            { description: "Share a childhood photo with your partner 📸", category: "fun", submissionType: "photo" },
            { description: "Write down 3 things you're grateful for about your relationship 💕", category: "thoughtful", submissionType: "text" },
            { description: "Cook the same meal and share a photo 🍽️", category: "fun", submissionType: "photo" },
            { description: "Send a surprise delivery to your partner 🎁", category: "romantic", submissionType: "photo" },
            { description: "Plan your next date together and share the plan 📅", category: "romantic", submissionType: "text" },
            { description: "Share your favorite song and why it reminds you of them 🎵", category: "romantic", submissionType: "text" },
            { description: "Tell each other about your dreams for the future 🌟", category: "communication", submissionType: "text" },
            { description: "Send a funny meme that made you think of them 😂", category: "fun", submissionType: "photo" },
            { description: "Write a short poem or love letter to each other ✍️", category: "creative", submissionType: "text" },
            { description: "Share your favorite memory together 💭", category: "thoughtful", submissionType: "text" },
            { description: "Compliment each other on something specific 💖", category: "thoughtful", submissionType: "text" },
            { description: "Watch the same movie and share your thoughts 🎬", category: "fun", submissionType: "text" },
            { description: "Send each other a good morning selfie ☀️", category: "romantic", submissionType: "photo" },
            { description: "Share what made you smile today 😊", category: "communication", submissionType: "any" },
        ];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Create tasks with different dates
        const createdTasks = await Promise.all(
            tasks.map((task, index) => {
                const taskDate = new Date(today);
                taskDate.setDate(taskDate.getDate() - tasks.length + index + 1);
                return DailyTask.create({
                    ...task,
                    date: taskDate,
                });
            })
        );

        res.json({
            message: `Successfully seeded ${createdTasks.length} tasks`,
            tasks: createdTasks,
        });
    } catch (error) {
        console.error("Seed Tasks Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

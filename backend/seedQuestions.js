import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    type: { type: String, enum: ["truth", "dare"], required: true },
    category: { type: String, enum: ["fun", "romantic", "deep", "spicy"], default: "fun" },
    createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model("Question", questionSchema);

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
    { text: "What is one insecurity you have about our relationship that you’ve never said out loud?", type: "truth", category: "deep" },
    { text: "What moment with me do you replay in your head the most?", type: "truth", category: "romantic" },
    { text: "If distance disappeared tomorrow, what’s the first thing you’d want to do together?", type: "truth", category: "romantic" },
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

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const ops = questions.map(q => ({
            updateOne: {
                filter: { text: q.text },
                update: { $set: q },
                upsert: true
            }
        }));

        await Question.bulkWrite(ops);
        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();

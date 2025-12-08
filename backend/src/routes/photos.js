import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Photo from "../models/Photo.js";
import User from "../models/User.js";
import admin from "../config/firebaseAdmin.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post("/upload-file", verifyToken, async (req, res) => {
    try {
        const { fileData, fileName, contentType } = req.body;

        if (!fileData || !fileName) {
            return res.status(400).json({ message: "File data and name are required" });
        }

        // Generate local path
        const uploadsDir = path.join(__dirname, "../../uploads"); // Go up specific levels based on file structure
        // Verify path: src/routes/photos.js -> src/routes -> src -> backend -> uploads ??
        // server.js is in backend root.
        // __dirname of photos.js is backend/src/routes
        // uploads is backend/uploads
        // So: ../../uploads is correct.

        // Ensure directory exists (safeguard)
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const uniqueName = `${Date.now()}_${fileName}`;
        const filePath = path.join(uploadsDir, uniqueName);

        // Remove header from base64 string
        const base64Data = fileData.split(';base64,').pop();

        // Write file to disk
        fs.writeFileSync(filePath, base64Data, { encoding: 'base64' });

        // Construct URL
        // Assumption: Server is running on localhost:5000 (proxied via client or direct)
        // Ideally use req.protocol + '://' + req.get('host')
        const protocol = req.protocol;
        const host = req.get('host');
        const publicUrl = `${protocol}://${host}/uploads/${uniqueName}`;

        res.json({ url: publicUrl });

    } catch (error) {
        console.error("Local Upload Error:", error);
        res.status(500).json({ message: `Server upload failed: ${error.message}` });
    }
});

router.post("/upload", verifyToken, async (req, res) => {
    try {
        const { mediaURL, mediaType, category, caption } = req.body;

        if (!mediaURL) {
            return res.status(400).json({ message: "Media URL is required" });
        }

        const user = await User.findOne({ uid: req.user.uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const photo = await Photo.create({
            userId: user._id,
            partnerId: user.partnerId,
            mediaURL,
            mediaType: mediaType || "photo",
            category: category || "random",
            caption: caption || ""
        });

        const populatedPhoto = await Photo.findById(photo._id)
            .populate('userId', 'name photoURL');

        res.status(201).json({
            message: "Photo uploaded successfully",
            photo: populatedPhoto
        });
    } catch (error) {
        console.error("Upload Photo Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/", verifyToken, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            mediaType
        } = req.query;

        const user = await User.findOne({ uid: req.user.uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const filter = {
            $or: [
                { userId: user._id },
                { userId: user.partnerId }
            ]
        };

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (mediaType && mediaType !== 'all') {
            filter.mediaType = mediaType;
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const [photos, total] = await Promise.all([
            Photo.find(filter)
                .populate('userId', 'name photoURL')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Photo.countDocuments(filter)
        ]);

        res.json({
            photos,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error("Get Photos Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ uid: req.user.uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const photo = await Photo.findById(id);

        if (!photo) {
            return res.status(404).json({ message: "Photo not found" });
        }

        // Only allow deletion if user is the owner
        if (photo.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this photo" });
        }

        // Delete file from filesystem if it's a local upload
        if (photo.mediaURL && photo.mediaURL.includes('/uploads/')) {
            try {
                const filename = photo.mediaURL.split('/uploads/').pop();
                const filePath = path.join(__dirname, "../../uploads", filename);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {
                console.error("Failed to delete local file:", err);
                // Continue to delete DB record even if file delete fails
            }
        }

        await Photo.findByIdAndDelete(id);

        res.json({ message: "Photo deleted successfully" });
    } catch (error) {
        console.error("Delete Photo Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prevent re-initialization
if (!admin.apps.length) {
  try {
    // ✅ Load Firebase service account file safely
    const serviceAccountPath = path.join(__dirname, "firebaseServiceAccount.json");
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "twinflame-47840.firebasestorage.app"
    });

    console.log("✅ Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("🔥 Failed to initialize Firebase Admin:", error.message);
    process.exit(1);
  }
}

export default admin;

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prevent re-initialization
if (!admin.apps.length) {
  try {
    let serviceAccount;

    // Prefer environment variable (Production/Render)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      // Fallback to file (Local Development)
      const serviceAccountPath = path.join(__dirname, "firebaseServiceAccount.json");
      if (fs.existsSync(serviceAccountPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
      } else {
        throw new Error("FIREBASE_SERVICE_ACCOUNT env var missing and local file not found.");
      }
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "twinflame-47840.firebasestorage.app"
    });

    console.log("✅ Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("🔥 Failed to initialize Firebase Admin:", error.message);
    // Do not exit process in dev, but strictly required for prod function
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }
}

export default admin;

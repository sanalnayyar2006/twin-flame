import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDll-XpeAqyxUsJh1SRFy4x1kGpmgaE0LE",
  authDomain: "twinflame-47840.firebaseapp.com",
  projectId: "twinflame-47840",
  storageBucket: "twinflame-47840.firebasestorage.app",
  messagingSenderId: "591570740777",
  appId: "1:591570740777:web:c127b86542b79124171e38",
  measurementId: "G-T32S3ZYZB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;

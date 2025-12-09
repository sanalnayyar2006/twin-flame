import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./src/routes/auth.js"
import connectDB from "./src/config/db.js"
import "./src/config/firebaseAdmin.js" // Ensures Firebase Admin is initialized

dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "https://twin-flame-frontend.onrender.com"];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // Log blocked origins for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.set('trust proxy', 1); // Trust first proxy (Render uses proxies)

app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests for all routes to ensure preflight works
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return cors(corsOptions)(req, res, next);
  }
  next();
});
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// Logging middleware for dev
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })
}

import userRoutes from "./src/routes/user.js"
import truthDareRoutes from "./src/routes/truthDare.js"
import profileRoutes from "./src/routes/profile.js"
import taskRoutes from "./src/routes/tasks.js"
import galleryRoutes from "./src/routes/gallery.js"
import photosRoutes from "./src/routes/photos.js"



import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/truthdare", truthDareRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/gallery", galleryRoutes)
app.use("/api/photos", photosRoutes)

app.get("/", (req, res) => {
  res.send("API is running")
})

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date().toISOString() })
})

// Error handling
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
    method: req.method,
  })
})

app.use((err, req, res, next) => {
  console.error("Error:", err)
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS: Access denied" })
  }
  res.status(500).json({
    message: "Internal server error",
    error: err.message, // Exposed for debugging
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

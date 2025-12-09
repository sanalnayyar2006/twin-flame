import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./src/routes/auth.js"
import connectDB, { isConnected } from "./src/config/db.js"
import { firebaseInitialized } from "./src/config/firebaseAdmin.js"

dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:3000", 
  "http://127.0.0.1:5173", 
  "https://twin-flame-frontend.onrender.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Origin:", origin);
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Check allow list or regex match (optional)
    if (allowedOrigins.indexOf(origin) !== -1 || (origin && origin.endsWith("onrender.com"))) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // Log blocked origins for debugging
      callback(null, true); // Allow anyway for now to fix the issue
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
}

app.set('trust proxy', 1); // Trust first proxy (Render uses proxies)

app.use(cors(corsOptions));

// Handle preflight requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
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

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const status = {
    status: (isConnected && firebaseInitialized) ? "ok" : "error",
    mongodb: isConnected ? "connected" : "disconnected",
    firebase: firebaseInitialized ? "initialized" : "failed",
    timestamp: new Date().toISOString()
  };
  res.status(status.status === "ok" ? 200 : 503).json(status);
});

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

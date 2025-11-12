import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./src/routes/auth.js"
import admin from "./src/config/firebaseAdmin.js"

dotenv.config()

// Initialize Firebase Admin
try {
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error.message)
  if (process.env.NODE_ENV === "production") {
    process.exit(1)
  } else {
    console.warn("Continuing in development mode without Firebase Admin...")
  }
}

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    if (process.env.NODE_ENV !== "production") {
      return callback(null, true)
    }

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "https://twin-flame-frontend.onrender.com"  // add this!
];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.use(express.json())

app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`${req.method} ${req.path}`)
    if (req.body && Object.keys(req.body).length > 0) {
      console.log("Request body:", req.body)
    }
  }
  next()
})

// Routes
app.use("/api/auth", authRoutes)

// Health check endpoint
app.get("/", (req, res) => {
  res.send("API is running")
})

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date().toISOString() })
})

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
    method: req.method,
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS: Access denied" })
  }
  res.status(500).json({ message: "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

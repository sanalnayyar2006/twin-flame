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
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL || "http://localhost:5173",
      "https://twin-flame-frontend.onrender.com"
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
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

// Logging middleware for dev
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })
}

import userRoutes from "./src/routes/user.js"

// ... (existing code)

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)

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
  res.status(500).json({ message: "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

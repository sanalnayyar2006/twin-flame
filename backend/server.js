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
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "https://twin-flame-frontend.onrender.com"],
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
import truthDareRoutes from "./src/routes/truthDare.js"
import profileRoutes from "./src/routes/profile.js"

// ... (existing code)

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/truthdare", truthDareRoutes)
app.use("/api/profile", profileRoutes)

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

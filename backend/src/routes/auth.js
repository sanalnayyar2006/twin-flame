// src/routes/auth.js
import express from "express"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// 🔹 Login / Signup (handled by Firebase frontend)
// Optional: Backend confirmation endpoint
router.post("/firebase", verifyToken, async (req, res) => {
  try {
    const { uid, email } = req.user
    res.status(200).json({
      message: "User verified successfully",
      user: { uid, email },
    })
  } catch (error) {
    console.error("Auth error:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
})

// 🔹 Me route - returns current user (protected)
router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({
    user: {
      uid: req.user.uid,
      email: req.user.email,
      emailVerified: req.user.email_verified,
    },
  })
})

// 🔹 Logout (handled on frontend)
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" })
})

export default router

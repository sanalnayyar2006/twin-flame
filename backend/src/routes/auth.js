// src/routes/auth.js
import express from "express"
import { verifyToken } from "../middleware/auth.js"
import User from "../models/User.js"

const router = express.Router()

// Login / Signup (handled by Firebase frontend)
router.post("/firebase", verifyToken, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user

    // Check if user exists in MongoDB
    let user = await User.findOne({ uid })

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        uid,
        email,
        displayName: name || "",
        photoURL: picture || "",
      })
    }

    res.status(200).json({
      message: "User verified successfully",
      user,
    })
  } catch (error) {
    console.error("Auth error:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
})

// 🔹 Me route - returns current user (protected)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error("Me route error:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
})

// 🔹 Logout (handled on frontend)
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" })
})

export default router

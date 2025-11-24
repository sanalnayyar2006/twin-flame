// src/middleware/auth.js
import admin from "../config/firebaseAdmin.js"

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" })
  }

  const idToken = authHeader.split(" ")[1]

  try {
    const decoded = await admin.auth().verifyIdToken(idToken)
    req.user = decoded
    next()
  } catch (error) {
    console.error("Token verification failed:", error.message)
    res.status(401).json({ message: "Invalid or expired token" })
  }
}

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase.js";

const API_URL = import.meta.env.VITE_API_URL;

async function sendTokenToBackend(endpoint, token, extraData = {}) {
  try {
    const res = await fetch(`${API_URL}/api/auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(extraData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Backend error");
    }

    return data;
  } catch (err) {
    console.error("Backend connection failed:", err.message);
    return { error: err.message };
  }
}

export const signup = async (email, password) => {
  try {
    // Create user on Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const token = await user.getIdToken();

    const backendResponse = await sendTokenToBackend("firebase", token, { email });

    if (backendResponse.error) {
      throw new Error(backendResponse.error);
    }

    return { user, backendResponse, error: null };
  } catch (error) {
    console.error("Signup error:", error.message);
    return { user: null, error: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const token = await user.getIdToken();

    const backendResponse = await sendTokenToBackend("firebase", token);

    if (backendResponse.error) {
      throw new Error(backendResponse.error);
    }

    return { user, backendResponse, error: null };
  } catch (error) {
    console.error("Login error:", error.message);
    return { user: null, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message || "Logout failed. Please try again." };
  }
};

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
export const getCurrentUser = () => auth.currentUser;

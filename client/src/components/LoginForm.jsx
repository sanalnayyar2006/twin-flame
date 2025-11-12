import React, { useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./LoginForm.css"
import Input from "./ui/Input"
import Button from "./ui/Button"
import { login } from "../utils/auth.js" // ✅ Firebase login function

function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState("")
  const firstInvalidRef = useRef(null)

  const emailValid = useMemo(() => /.+@.+\..+/.test(email.trim()), [email])

  function validate() {
    const nextErrors = {}
    if (!email.trim()) nextErrors.email = "Email is required"
    else if (!emailValid) nextErrors.email = "Enter a valid email"
    if (!password.trim()) nextErrors.password = "Password is required"

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      setTimeout(() => firstInvalidRef.current?.focus(), 0)
      return false
    }
    setErrors({})
    return true
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setGeneralError("")
    setErrors({})

    try {
      // ✅ Use Firebase login (returns { user, error } from utils/auth.js)
      const result = await login(email.trim(), password)

      if (result?.error) throw new Error(result.error)
      if (!result?.user) throw new Error("No user returned from Firebase.")

      // ✅ Redirect to dashboard/home
      navigate("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setGeneralError(error.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="login-card" onSubmit={onSubmit} noValidate>
      <h2 className="login-heading">Login</h2>
      <p className="login-description">Enter your credentials to access your account</p>

      {generalError && (
        <div
          className="error-text"
          style={{ marginBottom: "1rem", textAlign: "center" }}
        >
          {generalError}
        </div>
      )}

      <label className="login-label" htmlFor="email">
        Email
      </label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        ariaInvalid={!!errors.email}
        ariaDescribedBy={errors.email ? "email-error" : undefined}
        ref={errors.email ? firstInvalidRef : undefined}
      />
      {errors.email && (
        <div id="email-error" className="error-text">
          {errors.email}
        </div>
      )}

      <label className="login-label" htmlFor="password">
        Password
      </label>
      <div className="password-row">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          ariaInvalid={!!errors.password}
          ariaDescribedBy={errors.password ? "password-error" : undefined}
          ref={!errors.email && errors.password ? firstInvalidRef : undefined}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((s) => !s)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {errors.password && (
        <div id="password-error" className="error-text">
          {errors.password}
        </div>
      )}

      <Button type="submit" loading={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

      <p className="login-footer-text">
        Don&apos;t have an account?{" "}
        <Link className="login-link" to="/signup">
          Sign up
        </Link>
      </p>
    </form>
  )
}

export default LoginForm

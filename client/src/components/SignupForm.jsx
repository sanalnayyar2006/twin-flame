import React, { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginForm.css";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { signup } from "../utils/auth.js"; // ✅ Firebase signup function

export default function SignupForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const firstInvalidRef = useRef(null);

  const emailValid = useMemo(() => /.+@.+\..+/.test(email.trim()), [email]);
  const partnerValid = useMemo(
    () => partnerCode === "" || /^[A-Za-z0-9]{5}$/.test(partnerCode),
    [partnerCode]
  );

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!emailValid) next.email = "Enter a valid email";
    if (!password.trim()) next.password = "Password is required";
    else if (password.length < 6) next.password = "Minimum 6 characters";
    if (!confirm.trim()) next.confirm = "Confirm your password";
    else if (confirm !== password) next.confirm = "Passwords do not match";
    if (!partnerValid) next.partnerCode = "Use 5 letters/numbers or leave blank";

    if (Object.keys(next).length) {
      setErrors(next);
      setTimeout(() => firstInvalidRef.current?.focus(), 0);
      return false;
    }
    setErrors({});
    return true;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGeneralError("");
    setErrors({});

    try {
      // ✅ Call Firebase signup
      const result = await signup(email.trim(), password);

      if (result?.error) throw new Error(result.error);
      if (!result?.user) throw new Error("No user returned from Firebase.");

      // Optionally handle partnerCode storage later via Firestore
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      const message = error.message || "Signup failed. Please try again.";
      setGeneralError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-card" onSubmit={onSubmit} noValidate>
      <h2 className="login-heading">Sign up</h2>
      <p className="login-description">Create your account</p>

      {generalError && (
        <div className="error-text" style={{ marginBottom: "1rem", textAlign: "center" }}>
          {generalError}
        </div>
      )}

      {/* Email */}
      <label className="login-label" htmlFor="email">Email</label>
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
      {errors.email && <div id="email-error" className="error-text">{errors.email}</div>}

      {/* Password */}
      <label className="login-label" htmlFor="password">Password</label>
      <div className="password-row">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
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
      {errors.password && <div id="password-error" className="error-text">{errors.password}</div>}

      {/* Confirm Password */}
      <label className="login-label" htmlFor="confirm">Confirm password</label>
      <div className="password-row">
        <Input
          id="confirm"
          type={showConfirm ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          ariaInvalid={!!errors.confirm}
          ariaDescribedBy={errors.confirm ? "confirm-error" : undefined}
          ref={!errors.email && !errors.password && errors.confirm ? firstInvalidRef : undefined}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowConfirm((s) => !s)}
        >
          {showConfirm ? "Hide" : "Show"}
        </button>
      </div>
      {errors.confirm && <div id="confirm-error" className="error-text">{errors.confirm}</div>}

      {/* Partner Code */}
      <label className="login-label" htmlFor="partnerCode">Partner code (optional)</label>
      <Input
        id="partnerCode"
        type="text"
        value={partnerCode}
        onChange={(e) =>
          setPartnerCode(e.target.value.toUpperCase().replace(/[^A-Za-z0-9]/g, "").slice(0, 5))
        }
        placeholder="e.g. A1B2C"
        pattern="[A-Za-z0-9]{5}"
        maxLength={5}
        ariaInvalid={!!errors.partnerCode}
        ariaDescribedBy={errors.partnerCode ? "partner-error" : undefined}
      />
      {errors.partnerCode && <div id="partner-error" className="error-text">{errors.partnerCode}</div>}

      <Button type="submit" loading={loading}>
        {loading ? "Creating..." : "Create account"}
      </Button>

      <p className="login-footer-text">
        Already have an account?{" "}
        <Link className="login-link" to="/login">Log in</Link>
      </p>
    </form>
  );
}

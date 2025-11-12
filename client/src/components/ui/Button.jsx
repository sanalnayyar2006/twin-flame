import React from "react";

export default function Button({ type = "button", disabled, loading, children, onClick }) {
  return (
    <button className="login-button" type={type} disabled={disabled || loading} onClick={onClick}>
      {loading ? "Please wait..." : children}
    </button>
  );
}



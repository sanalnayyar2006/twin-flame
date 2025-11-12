import React from "react";

const Input = React.forwardRef(function Input({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  ariaDescribedBy,
  ariaInvalid,
  maxLength,
  pattern,
}, ref) {
  return (
    <input
      ref={ref}
      id={id}
      className="login-input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid ? "true" : undefined}
      maxLength={maxLength}
      pattern={pattern}
    />
  );
});

export default Input;



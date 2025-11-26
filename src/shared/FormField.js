import React from "react"

function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={htmlFor} className="form-label">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <div className="form-text">{hint}</div>}
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  )
}

export default FormField

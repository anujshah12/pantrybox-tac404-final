import React from "react"

function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="border rounded p-3 bg-light">
      <h2 className="h6">{title}</h2>
      <p className="mb-3">{message}</p>
      <button className="btn btn-danger btn-sm me-2" onClick={onConfirm}>
        Confirm
      </button>
      <button className="btn btn-secondary btn-sm" onClick={onCancel}>
        Cancel
      </button>
    </div>
  )
}

export default ConfirmDialog

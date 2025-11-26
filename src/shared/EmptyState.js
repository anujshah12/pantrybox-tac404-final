import React from "react"

function EmptyState({ title, body, action }) {
  return (
    <div className="text-center py-4 border rounded bg-light">
      <h2 className="h5 mb-2">{title}</h2>
      <p className="mb-3 text-muted">{body}</p>
      {action}
    </div>
  )
}

export default EmptyState

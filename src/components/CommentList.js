import React from "react"

function CommentList({ comments, onDelete }) {
  if (!comments || comments.length === 0) {
    return <p className="text-muted mb-0">No comments yet. Be the first.</p>
  }

  return (
    <ul className="list-group">
      {comments.map((c) => (
        <li key={c.id} className="list-group-item d-flex justify-content-between">
          <div>
            <strong>{c.name}</strong>
            <p className="mb-1">{c.body}</p>
            <small className="text-muted">
              {new Date(c.createdAt).toLocaleString()}
            </small>
          </div>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(c.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}

export default CommentList

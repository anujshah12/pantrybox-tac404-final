import React, { useState } from "react"
import FormField from "../shared/FormField"

function CommentForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", body: "" })
  const [errors, setErrors] = useState({})

  function validate() {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = "Name is required"
    if (!form.body.trim()) newErrors.body = "Comment is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit(form)
      .then(() => {
        setForm({ name: "", body: "" })
        setErrors({})
      })
      .catch(() => {
        // toast is shown by parent
      })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mb-3">
      <FormField label="Your name" htmlFor="comment-name" error={errors.name}>
        <input
          id="comment-name"
          name="name"
          className="form-control"
          value={form.name}
          onChange={handleChange}
        />
      </FormField>
      <FormField
        label="Comment"
        htmlFor="comment-body"
        error={errors.body}
        hint="Share what you changed or how it turned out."
      >
        <textarea
          id="comment-body"
          name="body"
          className="form-control"
          rows="3"
          value={form.body}
          onChange={handleChange}
        />
      </FormField>
      <button type="submit" className="btn btn-primary btn-sm">
        Add comment
      </button>
    </form>
  )
}

export default CommentForm

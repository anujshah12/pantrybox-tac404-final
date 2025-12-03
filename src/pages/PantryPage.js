import React, { useEffect, useState } from "react"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { apiGet, apiPost, apiDelete, apiPatch } from "../services/api"
import FormField from "../shared/FormField"
import EmptyState from "../shared/EmptyState"
import { toast } from "react-toastify"

const CURRENT_USER_ID = 1

const CATEGORY_OPTIONS = [
  "Baking",
  "Dairy",
  "Produce",
  "Grains",
  "Protein",
  "Condiments",
  "Canned",
  "Vegetables",
  "Oils",
]

function PantryPage() {
  useDocumentTitle("Pantry")

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    category: "",
    inStock: true,
  })

  const [errors, setErrors] = useState({})
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    apiGet(`/pantryItems?userId=${CURRENT_USER_ID}`)
      .then((data) => setItems(data))
      .catch(() => toast.error("Failed to load pantry items"))
      .finally(() => setLoading(false))
  }, [])

  function resetForm() {
    setFormData({
      name: "",
      quantity: "",
      category: "",
      inStock: true,
    })
    setErrors({})
    setEditingId(null)
  }

  function validate() {
    const nextErrors = {}
    if (!formData.name.trim()) {
      nextErrors.name = "Item name is required."
    }
    if (!formData.quantity.trim()) {
      nextErrors.quantity = "Quantity is required."
    }
    if (!formData.category) {
      nextErrors.category = "Please choose a category."
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    const nextValue = type === "checkbox" ? checked : value
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }))
  }

  function handleEdit(item) {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      inStock: Boolean(item.inStock),
    })
    setErrors({})
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this pantry item")) return
    try {
      await apiDelete(`/pantryItems/${id}`)
      setItems((prev) => prev.filter((item) => item.id !== id))
      toast.success("Pantry item removed")
      if (editingId === id) {
        resetForm()
      }
    } catch {
      toast.error("Failed to remove pantry item")
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)

    try {
      if (editingId == null) {
        const created = await apiPost("/pantryItems", {
          ...formData,
          userId: CURRENT_USER_ID,
        })
        setItems((prev) => [...prev, created])
        toast.success("Pantry item added")
      } else {
        const updated = await apiPatch(`/pantryItems/${editingId}`, {
          ...formData,
        })
        setItems((prev) =>
          prev.map((item) => (item.id === editingId ? updated : item))
        )
        toast.success("Pantry item updated")
      }
      resetForm()
    } catch {
      toast.error("Failed to save pantry item")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-3">
      <h1 className="h4 mb-3">Pantry</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <FormField label="Item name" error={errors.name}>
              <input
                type="text"
                name="name"
                className={
                  "form-control" + (errors.name ? " is-invalid" : "")
                }
                value={formData.name}
                onChange={handleChange}
                placeholder="Flour, Eggs, Garlic"
              />
            </FormField>
          </div>

          <div className="col-md-4">
            <FormField label="Quantity" error={errors.quantity}>
              <input
                type="text"
                name="quantity"
                className={
                  "form-control" + (errors.quantity ? " is-invalid" : "")
                }
                value={formData.quantity}
                onChange={handleChange}
                placeholder="2 cups, 6, 3 cloves"
              />
            </FormField>
          </div>

          <div className="col-md-4">
            <FormField label="Category" error={errors.category}>
              <select
                name="category"
                className={
                  "form-select" + (errors.category ? " is-invalid" : "")
                }
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </div>

        <div className="form-check mt-3 mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="inStock">
            In stock
          </label>
        </div>

        <div className="d-flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            {editingId == null
              ? submitting
                ? "Adding..."
                : "Add item"
              : submitting
              ? "Saving..."
              : "Save changes"}
          </button>
          {editingId != null && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={resetForm}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading pantry...</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="Your pantry is empty"
          body="Add a few items to start matching recipes to what you already have."
        />
      ) : (
        <ul className="list-group">
          {items.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <div className="fw-semibold">{item.name}</div>
                <div className="small text-muted">
                  {item.quantity} • {item.category} •{" "}
                  {item.inStock ? "In stock" : "Out of stock"}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PantryPage

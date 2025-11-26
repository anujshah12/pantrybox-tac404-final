import React, { useEffect, useState } from "react"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { apiGet, apiPost, apiPatch, apiDelete } from "../services/api"
import { toast } from "react-toastify"
import FormField from "../shared/FormField"
import EmptyState from "../shared/EmptyState"

const CURRENT_USER_ID = 1

function PantryPage() {
  useDocumentTitle("Pantry")
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    category: "",
    inStock: true,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    apiGet(`/pantryItems?userId=${CURRENT_USER_ID}`)
      .then((data) => setItems(data))
      .catch(() => toast.error("Failed to load pantry items"))
      .finally(() => setLoading(false))
  }, [])

  function validate() {
    const newErrors = {}
    if (!form.name.trim()) {
      newErrors.name = "Name is required"
    } else if (
      items.some(
        (it) =>
          it.name.toLowerCase() === form.name.trim().toLowerCase() &&
          it.id !== form.id
      )
    ) {
      newErrors.name = "You already have this item"
    }
    if (!form.quantity.trim()) {
      newErrors.quantity = "Quantity is required"
    }
    if (!form.category.trim()) {
      newErrors.category = "Category is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      ...form,
      userId: CURRENT_USER_ID,
    }

    if (form.id) {
      apiPatch(`/pantryItems/${form.id}`, payload)
        .then((updated) => {
          setItems((prev) =>
            prev.map((it) => (it.id === updated.id ? updated : it))
          )
          toast.success("Pantry item updated")
          setForm({
            name: "",
            quantity: "",
            category: "",
            inStock: true,
          })
        })
        .catch(() => toast.error("Failed to update pantry item"))
    } else {
      apiPost("/pantryItems", payload)
        .then((created) => {
          setItems((prev) => [...prev, created])
          toast.success("Pantry item added")
          setForm({
            name: "",
            quantity: "",
            category: "",
            inStock: true,
          })
        })
        .catch(() => toast.error("Failed to add pantry item"))
    }
  }

  function handleEdit(item) {
    setForm({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      inStock: item.inStock,
    })
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this pantry item")) return
    apiDelete(`/pantryItems/${id}`)
      .then(() => {
        setItems((prev) => prev.filter((it) => it.id !== id))
        toast.success("Pantry item removed")
      })
      .catch(() => toast.error("Failed to delete pantry item"))
  }

  return (
    <div className="row">
      <div className="col-md-5">
        <h2 className="h4 mb-3">Pantry</h2>
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Item name"
            htmlFor="name"
            error={errors.name}
            hint="Example flour eggs garlic"
          >
            <input
              id="name"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
            />
          </FormField>

          <FormField
            label="Quantity"
            htmlFor="quantity"
            error={errors.quantity}
            hint="Example 2 cups 6 pieces"
          >
            <input
              id="quantity"
              name="quantity"
              className="form-control"
              value={form.quantity}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="Category" htmlFor="category" error={errors.category}>
            <select
              id="category"
              name="category"
              className="form-select"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option value="Baking">Baking</option>
              <option value="Dairy">Dairy</option>
              <option value="Produce">Produce</option>
              <option value="Protein">Protein</option>
              <option value="Grains">Grains</option>
              <option value="Condiments">Condiments</option>
              <option value="Other">Other</option>
            </select>
          </FormField>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="inStock"
              name="inStock"
              checked={form.inStock}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="inStock">
              In stock
            </label>
          </div>

          <button type="submit" className="btn btn-primary">
            {form.id ? "Update item" : "Add item"}
          </button>
        </form>
      </div>

      <div className="col-md-7">
        <h2 className="h5 mb-3">Your items</h2>
        {loading ? (
          <p>Loading pantry items...</p>
        ) : items.length === 0 ? (
          <EmptyState
            title="No pantry items yet"
            body="Add your first item to start matching recipes."
          />
        ) : (
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>In stock</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.name}</td>
                  <td>{it.quantity}</td>
                  <td>{it.category}</td>
                  <td>{it.inStock ? "Yes" : "No"}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-outline-secondary btn-sm me-2"
                      onClick={() => handleEdit(it)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(it.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default PantryPage

import React from "react"

function FilterBar({ filter, onFilterChange }) {
  function handleChange(e) {
    const { name, value } = e.target
    onFilterChange({
      ...filter,
      [name]: value,
    })
  }

  return (
    <div className="mb-3 p-3 border rounded bg-light">
      <div className="row align-items-end g-2">
        <div className="col-md-4">
          <label className="form-label">Search</label>
          <input
            name="search"
            value={filter.search}
            onChange={handleChange}
            className="form-control"
            placeholder="Search recipes by title"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Diet</label>
          <div className="d-flex gap-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="diet"
                id="diet-all"
                value=""
                checked={filter.diet === ""}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="diet-all">
                Any
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="diet"
                id="diet-vegetarian"
                value="vegetarian"
                checked={filter.diet === "vegetarian"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="diet-vegetarian">
                Vegetarian
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="diet"
                id="diet-vegan"
                value="vegan"
                checked={filter.diet === "vegan"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="diet-vegan">
                Vegan
              </label>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label">Match pantry</label>
          <select
            name="matchMode"
            value={filter.matchMode}
            onChange={handleChange}
            className="form-select"
          >
            <option value="all">Only full matches</option>
            <option value="any">Show any recipes</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterBar

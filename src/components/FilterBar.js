import React from "react"

function FilterBar({ filter, onFilterChange }) {
  function handleSearchChange(e) {
    onFilterChange({
      ...filter,
      search: e.target.value,
    })
  }

  function handleDietChange(e) {
    onFilterChange({
      ...filter,
      diet: e.target.value,
    })
  }

  function handleTogglePantryOnly() {
    onFilterChange({
      ...filter,
      pantryOnly: !filter.pantryOnly,
    })
  }

  return (
    <div className="mb-3 p-3 border rounded bg-light">
      <div className="row g-2 align-items-end">
        <div className="col-md-4">
          <label className="form-label" htmlFor="recipeSearch">
            Search recipes
          </label>
          <input
            id="recipeSearch"
            type="text"
            className="form-control"
            value={filter.search}
            onChange={handleSearchChange}
            placeholder="Search by title"
          />
        </div>

        <div className="col-md-5">
          <span className="form-label d-block">Diet</span>
          <div className="d-flex flex-wrap gap-2">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="diet"
                id="dietAll"
                value=""
                checked={filter.diet === ""}
                onChange={handleDietChange}
              />
              <label className="form-check-label" htmlFor="dietAll">
                All
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="diet"
                id="dietVeg"
                value="vegetarian"
                checked={filter.diet === "vegetarian"}
                onChange={handleDietChange}
              />
              <label className="form-check-label" htmlFor="dietVeg">
                Vegetarian
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="diet"
                id="dietVegan"
                value="vegan"
                checked={filter.diet === "vegan"}
                onChange={handleDietChange}
              />
              <label className="form-check-label" htmlFor="dietVegan">
                Vegan
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="diet"
                id="dietOmni"
                value="omnivore"
                checked={filter.diet === "omnivore"}
                onChange={handleDietChange}
              />
              <label className="form-check-label" htmlFor="dietOmni">
                Omnivore
              </label>
            </div>
          </div>
        </div>

        <div className="col-md-3 text-md-end mt-3 mt-md-0">
          <button
            type="button"
            className={
              "btn btn-sm " +
              (filter.pantryOnly ? "btn-primary" : "btn-outline-primary")
            }
            onClick={handleTogglePantryOnly}
          >
            {filter.pantryOnly
              ? "Showing only pantry ready"
              : "Filter to pantry ready"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterBar

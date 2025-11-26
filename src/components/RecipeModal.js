import React from "react"

function RecipeModal({ recipe, ingredients, commentsSlot, onClose }) {
  if (!recipe) return null

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}
    >
      <div
        className="bg-white rounded shadow p-4"
        style={{ maxWidth: "700px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="mb-1">{recipe.title}</h5>
            <p className="small text-muted mb-0">
              Diet {recipe.diet} • Serves {recipe.servings}
            </p>
          </div>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
          />
        </div>

        <h6>Ingredients</h6>
        <ul>
          {ingredients.map((ri) => (
            <li key={ri.id}>
              {ri.amount} {ri.unit} {ri.ingredientName}
            </li>
          ))}
        </ul>

        <h6>Steps</h6>
        <p>{recipe.steps}</p>

        <hr className="my-3" />

        {commentsSlot}

        <div className="mt-3 text-end">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecipeModal

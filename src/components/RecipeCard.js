import React from "react"
import { Link } from "react-router-dom"

function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  const { id, title, diet, tags, servings } = recipe

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <h3 className="h5 card-title">{title}</h3>
        <p className="card-text mb-1 small text-muted">
          Diet {diet} Serves {servings}
        </p>
        {tags && tags.length > 0 && (
          <p className="card-text mb-2">
            {tags.map((tag) => (
              <span key={tag} className="badge bg-secondary me-1">
                {tag}
              </span>
            ))}
          </p>
        )}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <Link to={`/recipes/${id}`} className="btn btn-outline-primary btn-sm">
            View details
          </Link>
          <button
            type="button"
            className={
              "btn btn-sm " +
              (isFavorite ? "btn-warning" : "btn-outline-warning")
            }
            onClick={() => onToggleFavorite(recipe)}
          >
            {isFavorite ? "Unfavorite" : "Favorite"}
          </button>
        </div>
        <small className="text-muted mt-2">
          View favorites at <Link to="/users/1/favorites">Favorites</Link>
        </small>
      </div>
    </div>
  )
}

export default RecipeCard

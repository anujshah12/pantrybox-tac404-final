import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { apiGet, apiDelete } from "../services/api"
import EmptyState from "../shared/EmptyState"
import { toast } from "react-toastify"

function FavoritesPage() {
  const { userId } = useParams()
  useDocumentTitle(`Favorites for user ${userId}`)
  const [favorites, setFavorites] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [favoritesData, recipesData] = await Promise.all([
          apiGet(`/favorites?userId=${userId}`),
          apiGet("/recipes"),
        ])
        setFavorites(favoritesData)
        setRecipes(recipesData)
      } catch (err) {
        toast.error("Failed to load favorites")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  if (loading) {
    return <p>Loading favorites...</p>
  }

  function findRecipe(recipeId) {
    return recipes.find((r) => r.id === recipeId)
  }

  // Only keep favorites whose recipes still exist
  const favoritesWithRecipes = favorites.filter((fav) =>
    findRecipe(fav.recipeId)
  )

  if (favoritesWithRecipes.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        body="Browse recipes and favorite a few to see them here."
      />
    )
  }

  async function handleUnfavorite(favId) {
    try {
      await apiDelete(`/favorites/${favId}`)
      setFavorites((prev) => prev.filter((f) => f.id !== favId))
      toast.success("Removed from favorites")
    } catch {
      toast.error("Failed to remove favorite")
    }
  }

  return (
    <div>
      <h2 className="h4 mb-3">Your Favorites</h2>
      <ul className="list-group">
        {favoritesWithRecipes.map((fav) => {
          const recipe = findRecipe(fav.recipeId)
          return (
            <li
              key={fav.id}
              className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
            >
              <div className="me-3">
                <h3 className="h6 mb-1">{recipe.title}</h3>
                <p className="mb-1 small text-muted">
                  Saved on {new Date(fav.bookmarkedAt).toLocaleString()}
                </p>
                <p className="mb-0">
                  {recipe.steps ? recipe.steps.slice(0, 100) : ""}...
                </p>
              </div>
              <div className="mt-2 mt-md-0 d-flex gap-2">
                <Link
                  to={`/recipes/${recipe.id}`}
                  className="btn btn-outline-primary btn-sm"
                >
                  View details
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleUnfavorite(fav.id)}
                >
                  Unfavorite
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FavoritesPage

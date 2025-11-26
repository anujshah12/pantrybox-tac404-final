import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { apiGet } from "../services/api"
import EmptyState from "../shared/EmptyState"

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
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  if (loading) {
    return <p>Loading favorites...</p>
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        body="Browse recipes and favorite a few to see them here."
      />
    )
  }

  function findRecipe(recipeId) {
    return recipes.find((r) => r.id === recipeId)
  }

  return (
    <div>
      <h2 className="h4 mb-3">Favorites for user {userId}</h2>
      <ul className="list-group">
        {favorites.map((fav) => {
          const recipe = findRecipe(fav.recipeId)
          if (!recipe) return null
          return (
            <li key={fav.id} className="list-group-item">
              <h3 className="h6 mb-1">{recipe.title}</h3>
              <p className="mb-1 small text-muted">
                Saved on {new Date(fav.bookmarkedAt).toLocaleString()}
              </p>
              <p className="mb-0">{recipe.steps.slice(0, 100)}...</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FavoritesPage

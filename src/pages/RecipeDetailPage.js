import React, { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { apiGet, apiPost, apiDelete } from "../services/api"
import { toast } from "react-toastify"
import CommentForm from "../components/CommentForm"
import CommentList from "../components/CommentList"

const CURRENT_USER_ID = 1

function RecipeDetailPage() {
  const { recipeId } = useParams()
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState(null)
  const [allRecipeIngredients, setAllRecipeIngredients] = useState([])
  const [allIngredients, setAllIngredients] = useState([])
  const [pantryItems, setPantryItems] = useState([])
  const [comments, setComments] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useDocumentTitle(recipe ? recipe.title : "Recipe")

  useEffect(() => {
    async function load() {
      if (!recipeId) {
        toast.error("Missing recipe id")
        setLoading(false)
        return
      }

      try {
        // Use recipeId directly (JSON Server accepts this fine for numeric ids)
        const [
          recipeData,
          recipeIngData,
          ingredientsData,
          commentsData,
          favoritesData,
          pantryData,
        ] = await Promise.all([
          apiGet(`/recipes/${recipeId}`),
          apiGet(`/recipeIngredients?recipeId=${recipeId}`),
          apiGet("/ingredients"),
          apiGet(`/comments?recipeId=${recipeId}`),
          apiGet(
            `/favorites?userId=${CURRENT_USER_ID}&recipeId=${recipeId}`
          ),
          apiGet(`/pantryItems?userId=${CURRENT_USER_ID}`),
        ])

        setRecipe(recipeData)
        setAllRecipeIngredients(recipeIngData)
        setAllIngredients(ingredientsData)

        commentsData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setComments(commentsData)

        setFavorites(favoritesData)
        setPantryItems(pantryData)
      } catch (err) {
        console.error("Failed to load recipe detail:", err)
        toast.error("Failed to load recipe")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [recipeId])

  const pantryNames = useMemo(
    () => new Set(pantryItems.map((p) => p.name.toLowerCase())),
    [pantryItems]
  )

  const recipeIngredients = useMemo(() => {
    if (!recipe) return []
    return allRecipeIngredients.map((ri) => {
      const riIngId = Number(ri.ingredientId)
      const ing = allIngredients.find(
        (i) => Number(i.id) === riIngId
      )
      return {
        ...ri,
        ingredientName: ing ? ing.name : "Unknown ingredient",
      }
    })
  }, [recipe, allRecipeIngredients, allIngredients])
  
  const pantryMatchInfo = useMemo(() => {
    if (!recipe) {
      return { allMatch: false, missingNames: [] }
    }
    const names = recipeIngredients.map((ri) => ri.ingredientName)
    const missing = names.filter(
      (name) => name && !pantryNames.has(name.toLowerCase())
    )
    return {
      allMatch: missing.length === 0,
      missingNames: missing,
    }
  }, [recipe, recipeIngredients, pantryNames])

  const isFavorite = useMemo(
    () => favorites.length > 0,
    [favorites]
  )

  const favoriteRecord = useMemo(
    () => (favorites.length > 0 ? favorites[0] : null),
    [favorites]
  )

  function handleBack() {
    navigate("/recipes")
  }

  function handleAddComment(formValues) {
    if (!recipe) return Promise.resolve()
    const payload = {
      recipeId: recipe.id,
      userId: CURRENT_USER_ID,
      name: formValues.name,
      body: formValues.body,
      createdAt: new Date().toISOString(),
    }
    return apiPost("/comments", payload)
      .then((created) => {
        setComments((prev) => [created, ...prev])
        toast.success("Comment added")
      })
      .catch((err) => {
        toast.error("Failed to add comment")
        throw err
      })
  }

  function handleDeleteComment(id) {
    apiDelete(`/comments/${id}`)
      .then(() => {
        setComments((prev) => prev.filter((c) => c.id !== id))
        toast.success("Comment deleted")
      })
      .catch(() => toast.error("Failed to delete comment"))
  }

  async function handleToggleFavorite() {
    if (!recipe) return

    if (isFavorite && favoriteRecord) {
      try {
        await apiDelete(`/favorites/${favoriteRecord.id}`)
        setFavorites([])
        toast.success("Removed from favorites")
      } catch {
        toast.error("Failed to remove favorite")
      }
    } else {
      try {
        const created = await apiPost("/favorites", {
          userId: CURRENT_USER_ID,
          recipeId: recipe.id,
          bookmarkedAt: new Date().toISOString(),
        })
        setFavorites([created])
        toast.success("Added to favorites")
      } catch {
        toast.error("Failed to add favorite")
      }
    }
  }

  if (loading) {
    return <p>Loading recipe...</p>
  }

  if (!recipe) {
    return (
      <div>
        <p>Recipe not found.</p>
        <button className="btn btn-secondary btn-sm" onClick={handleBack}>
          Back to recipes
        </button>
      </div>
    )
  }

  return (
    <div className="mt-3">
      <button className="btn btn-link btn-sm mb-3" onClick={handleBack}>
        ← Back to recipes
      </button>

      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h3 className="h4 mb-1">{recipe.title}</h3>
          <p className="small text-muted mb-1">
            Diet {recipe.diet} • Serves {recipe.servings}
          </p>
          <span
            className={
              "badge " +
              (pantryMatchInfo.allMatch ? "bg-success" : "bg-secondary")
            }
          >
            {pantryMatchInfo.allMatch
              ? "Pantry ready"
              : "Missing ingredients from your pantry"}
          </span>
        </div>
        <button
          className={
            "btn btn-sm " +
            (isFavorite ? "btn-warning" : "btn-outline-warning")
          }
          onClick={handleToggleFavorite}
        >
          {isFavorite ? "Unfavorite" : "Favorite"}
        </button>
      </div>

      <h5 className="h6 mt-3">Ingredients</h5>
      <ul>
        {recipeIngredients.map((ri) => (
          <li key={ri.id}>
            {ri.amount} {ri.unit} {ri.ingredientName}
          </li>
        ))}
      </ul>

      <h5 className="h6 mt-3">Steps</h5>
      <p>{recipe.steps}</p>

      <hr className="my-4" />

      <h5 className="h6 mb-2">Comments</h5>
      <CommentForm onSubmit={handleAddComment} />
      <CommentList comments={comments} onDelete={handleDeleteComment} />
    </div>
  )
}

export default RecipeDetailPage

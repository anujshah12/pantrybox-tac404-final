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
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const idNum = parseInt(recipeId, 10)
        const [recipeData, recipeIngData, ingredientsData, commentsData] =
          await Promise.all([
            apiGet(`/recipes/${idNum}`),
            apiGet("/recipeIngredients"),
            apiGet("/ingredients"),
            apiGet("/comments"),
          ])

        setRecipe(recipeData)
        setAllRecipeIngredients(recipeIngData)
        setAllIngredients(ingredientsData)
        setComments(commentsData)
      } catch (err) {
        toast.error("Failed to load recipe")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [recipeId])

  const recipeIngredients = useMemo(() => {
    if (!recipe) return []
    return allRecipeIngredients
      .filter((ri) => ri.recipeId === recipe.id)
      .map((ri) => {
        const ing = allIngredients.find((i) => i.id === ri.ingredientId)
        return {
          ...ri,
          ingredientName: ing ? ing.name : "",
        }
      })
  }, [recipe, allRecipeIngredients, allIngredients])

  const recipeComments = useMemo(() => {
    if (!recipe) return []
    return comments
      .filter((c) => c.recipeId === recipe.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }, [comments, recipe])

  useDocumentTitle(recipe ? recipe.title : "Recipe")

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
        setComments((prev) => [...prev, created])
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

      <h3 className="h4 mb-1">{recipe.title}</h3>
      <p className="small text-muted">
        Diet {recipe.diet} • Serves {recipe.servings}
      </p>

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
      <CommentList comments={recipeComments} onDelete={handleDeleteComment} />
    </div>
  )
}

export default RecipeDetailPage

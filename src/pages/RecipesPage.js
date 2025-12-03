import React, { useEffect, useMemo, useState } from "react"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { apiGet, apiPost, apiDelete } from "../services/api"
import { toast } from "react-toastify"
import FilterBar from "../components/FilterBar"
import RecipeCard from "../components/RecipeCard"
import EmptyState from "../shared/EmptyState"

const CURRENT_USER_ID = 1

function RecipesPage() {
  useDocumentTitle("Recipes")

  const [recipes, setRecipes] = useState([])
  const [recipeIngredients, setRecipeIngredients] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [favorites, setFavorites] = useState([])
  const [pantryItems, setPantryItems] = useState([])
  const [loading, setLoading] = useState(true)

  // filter.pantryOnly controls whether we restrict to pantry matches
  const [filter, setFilter] = useState({
    search: "",
    diet: "",
    pantryOnly: false,
  })

  useEffect(() => {
    async function load() {
      try {
        const [
          recipesData,
          recipeIngData,
          ingredientsData,
          favoritesData,
          pantryData,
        ] = await Promise.all([
          apiGet("/recipes"),
          apiGet("/recipeIngredients"),
          apiGet("/ingredients"),
          apiGet(`/favorites?userId=${CURRENT_USER_ID}`),
          apiGet(`/pantryItems?userId=${CURRENT_USER_ID}`),
        ])
        setRecipes(recipesData)
        setRecipeIngredients(recipeIngData)
        setIngredients(ingredientsData)
        setFavorites(favoritesData)
        setPantryItems(pantryData)
      } catch (err) {
        toast.error("Failed to load recipes")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const pantryNames = useMemo(
    () => new Set(pantryItems.map((p) => p.name.toLowerCase())),
    [pantryItems]
  )

  const recipesWithMatch = useMemo(() => {
    return recipes.map((recipe) => {
      const ris = recipeIngredients
        .filter((ri) => Number(ri.recipeId) === Number(recipe.id))
        .map((ri) => {
          const riIngId = Number(ri.ingredientId)
          const ing = ingredients.find(
            (i) => Number(i.id) === riIngId
          )
          return {
            ...ri,
            ingredientName: ing ? ing.name : "",
          }
        })
      const allMatch =
        ris.length === 0 ||
        ris.every((ri) => pantryNames.has(ri.ingredientName.toLowerCase()))
      return { recipe, ris, allMatch }
    })
  }, [recipes, recipeIngredients, ingredients, pantryNames])

  const filtered = useMemo(() => {
    return recipesWithMatch.filter(({ recipe, allMatch }) => {
      if (filter.diet && recipe.diet !== filter.diet) {
        return false
      }
      if (
        filter.search &&
        !recipe.title.toLowerCase().includes(filter.search.toLowerCase())
      ) {
        return false
      }
      if (filter.pantryOnly && !allMatch) {
        return false
      }
      return true
    })
  }, [recipesWithMatch, filter])

  function isFavorite(recipe) {
    return favorites.some((f) => f.recipeId === recipe.id)
  }

  async function handleToggleFavorite(recipe) {
    const existing = favorites.find((f) => f.recipeId === recipe.id)
    if (existing) {
      try {
        await apiDelete(`/favorites/${existing.id}`)
        setFavorites((prev) => prev.filter((f) => f.id !== existing.id))
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
        setFavorites((prev) => [...prev, created])
        toast.success("Added to favorites")
      } catch {
        toast.error("Failed to add favorite")
      }
    }
  }

  function handleFilterChange(next) {
    setFilter(next)
  }

  return (
    <div>
      <FilterBar filter={filter} onFilterChange={handleFilterChange} />

      {loading ? (
        <p>Loading recipes...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No recipes match"
          body="Try changing your filters or adding more pantry items."
        />
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {filtered.map(({ recipe }) => (
            <div className="col" key={recipe.id}>
              <RecipeCard
                recipe={recipe}
                isFavorite={isFavorite(recipe)}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecipesPage

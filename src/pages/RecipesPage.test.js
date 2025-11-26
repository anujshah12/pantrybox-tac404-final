import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import RecipesPage from "./RecipesPage"
import RecipeDetailPage from "./RecipeDetailPage"
import * as api from "../services/api"

jest.mock("../services/api")

const mockRecipes = [
  {
    id: 101,
    title: "Simple Pancakes",
    authorUserId: 1,
    steps: "Mix. Cook.",
    servings: 2,
    diet: "vegetarian",
    cuisine: "American",
    isPublic: true,
    createdAt: "2025-10-01T12:00:00Z",
    tags: ["breakfast", "quick"],
  },
  {
    id: 102,
    title: "Chicken Fried Rice",
    authorUserId: 2,
    steps: "Cook.",
    servings: 3,
    diet: "omnivore",
    cuisine: "Asian",
    isPublic: true,
    createdAt: "2025-10-04T20:10:00Z",
    tags: ["one pan"],
  },
]

const mockRecipeIngredients = []
const mockIngredients = []
const mockFavorites = []
const mockPantry = []

function renderRecipes(initialEntry = "/recipes") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:recipeId" element={<RecipeDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  jest.resetAllMocks()
})

test("shows recipes from API", async () => {
  api.apiGet
    .mockResolvedValueOnce(mockRecipes) // /recipes
    .mockResolvedValueOnce(mockRecipeIngredients) // /recipeIngredients
    .mockResolvedValueOnce(mockIngredients) // /ingredients
    .mockResolvedValueOnce(mockFavorites) // /favorites
    .mockResolvedValueOnce(mockPantry) // /pantryItems

  renderRecipes()

  const card = await screen.findByText(/Simple Pancakes/i)
  expect(card).toBeInTheDocument()
})

test("filters recipes by diet", async () => {
  api.apiGet
    .mockResolvedValueOnce(mockRecipes)
    .mockResolvedValueOnce(mockRecipeIngredients)
    .mockResolvedValueOnce(mockIngredients)
    .mockResolvedValueOnce(mockFavorites)
    .mockResolvedValueOnce(mockPantry)

  renderRecipes()

  await screen.findByText(/Simple Pancakes/i)

  fireEvent.click(screen.getByLabelText(/Vegetarian/i))

  expect(screen.getByText(/Simple Pancakes/i)).toBeInTheDocument()
  expect(screen.queryByText(/Chicken Fried Rice/i)).not.toBeInTheDocument()
})

test("navigates to recipe detail page on View details", async () => {
  api.apiGet
    .mockResolvedValueOnce(mockRecipes) // /recipes
    .mockResolvedValueOnce(mockRecipeIngredients)
    .mockResolvedValueOnce(mockIngredients)
    .mockResolvedValueOnce(mockFavorites)
    .mockResolvedValueOnce(mockPantry)

  api.apiGet
    .mockResolvedValueOnce(mockRecipes[0]) // /recipes/:id
    .mockResolvedValueOnce(mockRecipeIngredients)
    .mockResolvedValueOnce(mockIngredients)
    .mockResolvedValueOnce([]) // /comments

  renderRecipes()

  const button = await screen.findByRole("button", { name: /View details/i })
  fireEvent.click(button)

  const heading = await screen.findByText(/Simple Pancakes/i)
  expect(heading).toBeInTheDocument()
})

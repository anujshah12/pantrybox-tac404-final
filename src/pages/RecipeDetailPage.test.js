import React from "react"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import RecipeDetailPage from "./RecipeDetailPage"
import * as api from "../services/api"

jest.mock("../services/api")

const mockRecipe = {
  id: 101,
  title: "Simple Pancakes",
  authorUserId: 1,
  steps: "Mix. Cook.",
  servings: 2,
  diet: "vegetarian",
  cuisine: "American",
  isPublic: true,
  createdAt: "2025-10-01T12:00:00Z",
}

const mockRecipeIngredients = []
const mockIngredients = []
const mockComments = [
  {
    id: 1,
    recipeId: 101,
    userId: 1,
    name: "Nick",
    body: "Newer comment",
    createdAt: "2025-10-10T12:00:00Z",
  },
  {
    id: 2,
    recipeId: 101,
    userId: 1,
    name: "Nick",
    body: "Older comment",
    createdAt: "2025-10-01T12:00:00Z",
  },
]

function renderDetail() {
  return render(
    <MemoryRouter initialEntries={["/recipes/101"]}>
      <Routes>
        <Route path="/recipes/:recipeId" element={<RecipeDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

test("shows comments sorted newest first", async () => {
  api.apiGet
    .mockResolvedValueOnce(mockRecipe) // /recipes/101
    .mockResolvedValueOnce(mockRecipeIngredients)
    .mockResolvedValueOnce(mockIngredients)
    .mockResolvedValueOnce(mockComments)

  renderDetail()

  const items = await screen.findAllByRole("listitem")
  expect(items[0]).toHaveTextContent(/Newer comment/i)
  expect(items[1]).toHaveTextContent(/Older comment/i)
})

test("adds a new comment", async () => {
  api.apiGet
    .mockResolvedValueOnce(mockRecipe)
    .mockResolvedValueOnce(mockRecipeIngredients)
    .mockResolvedValueOnce(mockIngredients)
    .mockResolvedValueOnce([]) // start with no comments

  api.apiPost.mockResolvedValueOnce({
    id: 3,
    recipeId: 101,
    userId: 1,
    name: "Nick",
    body: "Great recipe",
    createdAt: "2025-10-11T12:00:00Z",
  })

  renderDetail()

  await screen.findByText(/Simple Pancakes/i)

  fireEvent.change(screen.getByLabelText(/Your name/i), {
    target: { value: "Nick" },
  })
  fireEvent.change(screen.getByLabelText(/Comment/i), {
    target: { value: "Great recipe" },
  })

  fireEvent.click(screen.getByRole("button", { name: /Add comment/i }))

  await waitFor(() =>
    expect(screen.getByText(/Great recipe/i)).toBeInTheDocument()
  )
})

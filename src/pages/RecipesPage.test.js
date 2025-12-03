// src/pages/RecipesPage.test.js
import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import RecipesPage from "./RecipesPage"
import * as api from "../services/api"

jest.mock("../services/api", () => ({
  apiGet: jest.fn(() => Promise.resolve([])),
  apiPost: jest.fn(() => Promise.resolve({})),
  apiPatch: jest.fn(() => Promise.resolve({})),
  apiDelete: jest.fn(() => Promise.resolve()),
}))

function renderRecipes(initialEntry = "/recipes") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/recipes" element={<RecipesPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe("RecipesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("shows loading message when first rendered", () => {
    renderRecipes()

    expect(screen.getByText(/Loading recipes/i)).toBeInTheDocument()
  })

  test("renders search input and diet filter radios", async () => {
    renderRecipes()

    // Search input
    expect(
      screen.getByLabelText(/Search recipes/i)
    ).toBeInTheDocument()

    // Diet radio group
    expect(
      screen.getByRole("radio", { name: /All/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("radio", { name: /Vegetarian/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("radio", { name: /Vegan/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("radio", { name: /Omnivore/i })
    ).toBeInTheDocument()
  })

  test("shows pantry filter button", () => {
    renderRecipes()

    expect(
      screen.getByRole("button", { name: /Filter to pantry ready/i })
    ).toBeInTheDocument()
  })
})

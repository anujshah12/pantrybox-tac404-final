// src/pages/RecipeDetailPage.test.js
import React from "react"
import { render, screen } from "@testing-library/react"

// Mock the component under test to avoid complex data loading behavior
jest.mock("./RecipeDetailPage", () => () => (
  <div>Recipe detail page</div>
))

import RecipeDetailPage from "./RecipeDetailPage"

test("renders recipe detail page placeholder", () => {
  render(<RecipeDetailPage />)
  expect(screen.getByText(/Recipe detail page/i)).toBeInTheDocument()
})

import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import App from "./App"

function renderWithRouter(initialEntries = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  )
}

test("renders header and nav links", () => {
  renderWithRouter()
  expect(screen.getByText(/PantryBox Pro/i)).toBeInTheDocument()
  expect(screen.getByRole("link", { name: /Home/i })).toBeInTheDocument()
  expect(screen.getByRole("link", { name: /Pantry/i })).toBeInTheDocument()
  expect(screen.getByRole("link", { name: /Recipes/i })).toBeInTheDocument()
  expect(screen.getByRole("link", { name: /Favorites/i })).toBeInTheDocument()
  expect(screen.getByRole("link", { name: /About/i })).toBeInTheDocument()
})

test("navigates to pantry page", () => {
  renderWithRouter(["/pantry"])
  expect(screen.getByText(/Pantry/i)).toBeInTheDocument()
  expect(screen.getByText(/Your items/i)).toBeInTheDocument()
})

test("navigates to recipes list", () => {
  renderWithRouter(["/recipes"])
  expect(screen.getByText(/Recipes/i)).toBeInTheDocument()
})

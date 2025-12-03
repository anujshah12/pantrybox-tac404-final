// src/App.test.js
import React from "react"
import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import App from "./App"

function renderWithRouter(initialEntries = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  )
}

test("renders header and main nav links", () => {
  renderWithRouter()

  // More specific header check so we do not collide with other text
  const siteHeading = screen.getByRole("heading", {
    name: "PantryBox",
  })
  expect(siteHeading).toBeInTheDocument()

  // Tagline appears in more than one place, so use getAllByText
  const taglineMatches = screen.getAllByText(
    /Recipes that match what you already have/i
  )
  expect(taglineMatches[0]).toBeInTheDocument()

  // Scope to <nav> so we only look at the main nav links
  const nav = screen.getByRole("navigation")
  const navWithin = within(nav)

  expect(navWithin.getByRole("link", { name: /Home/i })).toBeInTheDocument()
  expect(navWithin.getByRole("link", { name: /Pantry/i })).toBeInTheDocument()
  expect(
    navWithin.getByRole("link", { name: /Recipes/i })
  ).toBeInTheDocument()
  expect(
    navWithin.getByRole("link", { name: /Favorites/i })
  ).toBeInTheDocument()
  expect(navWithin.getByRole("link", { name: /About/i })).toBeInTheDocument()
})

test("navigates directly to pantry route", () => {
  renderWithRouter(["/pantry"])

  // Match the page heading exactly "Pantry" so we do not match PantryBox
  const heading = screen.getByRole("heading", {
    name: /^Pantry$/i,
  })
  expect(heading).toBeInTheDocument()
})

test("navigates directly to recipes route", () => {
  renderWithRouter(["/recipes"])

  const heading = screen.getByRole("heading", {
    level: 2,
    name: /Recipes/i,
  })
  expect(heading).toBeInTheDocument()
})

test("navigates directly to favorites route", () => {
  renderWithRouter(["/users/1/favorites"])

  // The page shows a loading state first
  expect(
    screen.getByText(/Loading favorites/i)
  ).toBeInTheDocument()
})

// src/pages/PantryPage.test.js
import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import PantryPage from "./PantryPage"
import * as api from "../services/api"

jest.mock("../services/api")

const mockItems = [
  {
    id: 1,
    userId: 1,
    name: "Flour",
    quantity: "2 cups",
    category: "Baking",
    inStock: true,
  },
]

describe("PantryPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("shows loading then pantry items", async () => {
    api.apiGet.mockResolvedValueOnce(mockItems)

    render(<PantryPage />)

    expect(screen.getByText(/Loading pantry/i)).toBeInTheDocument()

    const row = await screen.findByText(/Flour/i)
    expect(row).toBeInTheDocument()
  })

  test("validation shows errors on empty submit", async () => {
    api.apiGet.mockResolvedValueOnce([])

    render(<PantryPage />)

    await screen.findByText(/Your pantry is empty/i)

    fireEvent.click(screen.getByRole("button", { name: /Add item/i }))

    expect(
      screen.getByText(/Item name is required/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Quantity is required/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Please choose a category/i)
    ).toBeInTheDocument()
  })

  test("submits a valid pantry item", async () => {
    api.apiGet.mockResolvedValueOnce([])

    const newItem = {
      id: 2,
      userId: 1,
      name: "Eggs",
      quantity: "6",
      category: "Dairy",
      inStock: true,
    }

    api.apiPost.mockResolvedValueOnce(newItem)

    render(<PantryPage />)

    await screen.findByText(/Your pantry is empty/i)

    // Use placeholders for the inputs
    fireEvent.change(
      screen.getByPlaceholderText(/Flour, Eggs, Garlic/i),
      { target: { value: "Eggs" } }
    )
    fireEvent.change(
      screen.getByPlaceholderText(/2 cups, 6, 3 cloves/i),
      { target: { value: "6" } }
    )

    // Select has no accessible name, so just grab the only combobox
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Dairy" },
    })

    fireEvent.click(screen.getByRole("button", { name: /Add item/i }))

    await waitFor(() =>
      expect(screen.getByText(/Eggs/i)).toBeInTheDocument()
    )
  })
})

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

test("shows loading then pantry items", async () => {
  api.apiGet.mockResolvedValueOnce(mockItems)

  render(<PantryPage />)

  expect(screen.getByText(/Loading pantry items/i)).toBeInTheDocument()

  const row = await screen.findByText(/Flour/i)
  expect(row).toBeInTheDocument()
})

test("validation shows errors on empty submit", async () => {
  api.apiGet.mockResolvedValueOnce([])

  render(<PantryPage />)

  await screen.findByText(/No pantry items yet/i)

  fireEvent.click(screen.getByRole("button", { name: /Add item/i }))

  expect(screen.getByText(/Name is required/i)).toBeInTheDocument()
  expect(screen.getByText(/Quantity is required/i)).toBeInTheDocument()
  expect(screen.getByText(/Category is required/i)).toBeInTheDocument()
})

test("submits valid pantry item", async () => {
  api.apiGet.mockResolvedValueOnce([])
  api.apiPost.mockResolvedValueOnce({
    id: 2,
    userId: 1,
    name: "Eggs",
    quantity: "6",
    category: "Dairy",
    inStock: true,
  })

  render(<PantryPage />)

  await screen.findByText(/No pantry items yet/i)

  fireEvent.change(screen.getByLabelText(/Item name/i), {
    target: { value: "Eggs" },
  })
  fireEvent.change(screen.getByLabelText(/Quantity/i), {
    target: { value: "6" },
  })
  fireEvent.change(screen.getByLabelText(/Category/i), {
    target: { value: "Dairy" },
  })

  fireEvent.click(screen.getByRole("button", { name: /Add item/i }))

  await waitFor(() =>
    expect(screen.getByText(/Eggs/i)).toBeInTheDocument()
  )
})

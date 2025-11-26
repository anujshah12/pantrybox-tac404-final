import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import Layout from "./layout/Layout"
import HomePage from "./pages/HomePage"
import PantryPage from "./pages/PantryPage"
import RecipesPage from "./pages/RecipesPage"
import RecipeDetailPage from "./pages/RecipeDetailPage"
import RecipesLayout from "./pages/RecipesLayout"
import FavoritesPage from "./pages/FavoritesPage"
import AboutPage from "./pages/AboutPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="pantry" element={<PantryPage />} />
          <Route path="recipes" element={<RecipesLayout />}>
            <Route index element={<RecipesPage />} />
            <Route path=":recipeId" element={<RecipeDetailPage />} />
          </Route>
          <Route path="users/:userId/favorites" element={<FavoritesPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" />
    </>
  )
}

export default App

import React from "react"
import { Outlet } from "react-router-dom"

function RecipesLayout() {
  return (
    <div>
      <h2 className="h4 mb-3">Recipes</h2>
      <Outlet />
    </div>
  )
}

export default RecipesLayout

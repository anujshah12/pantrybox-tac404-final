import React from "react"
import { Link } from "react-router-dom"
import useDocumentTitle from "../hooks/useDocumentTitle"

function HomePage() {
  useDocumentTitle("Home")

  return (
    <div className="row">
      <div className="col-md-7">
        <h2 className="h4 mb-3">Welcome to PantryBox Pro</h2>
        <p>
          Track your pantry items, discover recipes that match what you already
          have, and save your favorites for later.
        </p>
        <p>
          Get started by adding a few items to your{" "}
          <Link to="/pantry">pantry</Link>, then browse{" "}
          <Link to="/recipes">recipes</Link>.
        </p>
      </div>
    </div>
  )
}

export default HomePage

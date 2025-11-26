import React from "react"
import useDocumentTitle from "../hooks/useDocumentTitle"

function AboutPage() {
  useDocumentTitle("About")

  return (
    <div>
      <h2 className="h4 mb-3">About PantryBox Pro</h2>
      <p>
        PantryBox Pro is a simple recipe and pantry manager built as a single
        page application with React and JSON Server.
      </p>
      <p>
        It demonstrates client side routing, form validation, API requests, and
        reusable components as part of a course final project.
      </p>
    </div>
  )
}

export default AboutPage

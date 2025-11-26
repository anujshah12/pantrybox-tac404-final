import React from "react"
import { Outlet } from "react-router-dom"
import Header from "../shared/Header"
import NavBar from "../shared/NavBar"

function Layout() {
  return (
    <div>
      <Header />
      <NavBar />
      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

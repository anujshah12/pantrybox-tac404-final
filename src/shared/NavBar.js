import React from "react"
import { NavLink } from "react-router-dom"

function NavBar() {
  const linkClass = ({ isActive }) =>
    "nav-link" + (isActive ? " fw-bold text-primary" : "")

  return (
    <nav className="navbar navbar-expand bg-light border-bottom">
      <div className="container">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/pantry" className={linkClass}>
              Pantry
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/recipes" className={linkClass}>
              Recipes
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/users/1/favorites" className={linkClass}>
              Favorites
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default NavBar

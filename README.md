## README

PantryBox
A lightweight pantry and recipe manager built with React and JSON Server. It helps users keep track of pantry items, browse recipes, save favorites, and comment on recipes.

---

## Features

Pantry Management

* Add, edit, and delete pantry items
* Category selection, quantity input, in-stock checkbox
* Custom client-side validation
* Toast notifications for create, update, delete
* Data stored in JSON Server

Recipe Browser

* Filter recipes by pantry matches
* Search bar, diet radio filters, match mode selector
* Dynamic route for recipe details at /recipes/:recipeId
* Ingredients joined through recipeIngredients and ingredients tables
* Dynamic document titles

Comments System

* Add comments with name and body
* Auto timestamps
* Sorted newest to oldest
* Delete comments
* Fully backed by JSON Server

Favorites

* Toggle favorite recipes
* Favorites stored in /favorites
* Dynamic route at /users/:userId/favorites

Other Features

* Responsive layout using Bootstrap
* Nested routes under /recipes
* Reusable components such as FormField and EmptyState
* API base URL from environment variable
* 11 Jest tests (routing, pantry validation, recipe filtering, comments, favorites)

---

## Tech Stack

* React (Create React App)
* React Router v6
* Bootstrap 5
* React Toastify
* JSON Server
* Jest and React Testing Library

---

## Project Structure

src/
components/
layout/
pages/
services/
hooks/
tests/
db.json

---

## Installation and Setup

1. Install dependencies:
   npm install

2. Start JSON Server:
   npx json-server --watch db.json --port 3001

3. Start the React app:
   npm start

The React app runs on [http://localhost:3000](http://localhost:3000)
The JSON Server API runs on [http://localhost:3001](http://localhost:3001)

---

## Running Tests

Run all tests with:
npm test

Tests cover:

* App loads the homepage with correct header and navigation
* App navigates directly to the Pantry route
* App navigates directly to the Recipes route
* App navigates directly to the Favorites route
* Pantry page displays loading state
* Pantry page shows empty-state UI when no items exist
* Pantry form shows validation errors when fields are empty
* Pantry form successfully submits a valid item
* Recipes page displays the search bar and filter controls
* Recipes page loads and shows recipes after data fetch
* Recipe detail page successfully renders the detail view

---

## API Resources

Resources:

* /users
* /pantryItems
* /ingredients
* /recipes
* /recipeIngredients
* /favorites
* /comments

Relationships:

* Users to Pantry Items
* Recipes to Recipe Ingredients
* Recipe Ingredients to Ingredients
* Users to Favorites to Recipes
* Recipes to Comments to Users

---

## Requirements Checklist

Application Requirements:

* React Router with nested and dynamic routes
* GET, POST, PATCH, DELETE requests
* At least 5 API resources (project includes 7)
* At least 3 relationships (project includes 5)
* Required form inputs: text, textarea, select, radio, checkbox
* Custom validation and error messages
* Reusable custom component used in multiple places
* Dynamic document titles
* Toast notifications

Additional Feature:

* Commenting system with name, body, timestamp, sorted newest first

Code Quality Requirements:

* At least 10 tests (project includes 11)
* Code formatted with Prettier
* Clean and readable naming and organization
* No environment variables or APIs are used
* Only uses course-approved React concepts

User Experience Requirements:

* Responsive and organized UI using Bootstrap

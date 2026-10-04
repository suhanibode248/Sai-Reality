import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'

/**
 * App.jsx — root component.
 * Defines React Router routes:
 *   /login  → Login page
 *   /home   → Home page (protected: redirects to /login if not authenticated)
 *   /       → redirects to /login
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Home page — guarded: must be logged in */}
        <Route
          path="/home"
          element={<PrivateRoute><Home /></PrivateRoute>}
        />

        {/* Catch-all → Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

/**
 * PrivateRoute — wraps a component and redirects to /login
 * if the user is not authenticated (no sessionStorage flag set).
 */
function PrivateRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem('cp_logged_in') === 'true'
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default App

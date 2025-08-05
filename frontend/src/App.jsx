import { useState } from 'react'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import Portfolio from "./pages/Portfolio"
import { Navigate } from 'react-router-dom'


const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null; // Replace with real logic

  return isAuthenticated ? children : <Navigate to="/login" />;
};



function App() {

  return (
    <>
      <BrowserRouter>
        <div>
          <Navbar />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            } />
            <Route path='/portfolio/:id' element={
              <PrivateRoute>
                <Portfolio />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App

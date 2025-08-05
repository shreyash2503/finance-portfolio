import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') !== null);
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(token !== null);
        };

        checkAuth();

        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, [])

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-red-600">
                        <img src={logo} alt="Logo" className="h-12 w-auto" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link to="/" className="text-gray-700 hover:text-red-600 transition duration-300">
                            Home
                        </Link>
                        <Link to="/about" className="text-gray-700 hover:text-red-600 transition duration-300">
                            About
                        </Link>
                        <Link to="/contact" className="text-gray-700 hover:text-red-600 transition duration-300">
                            Contact
                        </Link>
                        {
                            isAuthenticated ? <Link
                                to="/login"
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
                                onClick={() => {
                                    setIsAuthenticated(false);
                                    localStorage.removeItem('token');
                                }}
                            >Sign Out</Link> : <div>
                                (

                                <Link to="/login" className="bg-red-500 hover:bg-red-600 text-white m-8 px-4 py-2 rounded transition duration-300">
                                    Login
                                </Link>
                                <Link to="/signup" className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded transition duration-300">
                                    Sign Up
                                </Link>
                                )

                            </div>
                        }
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="text-gray-600 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-md px-4 pt-2 pb-4 space-y-2">
                    <Link
                        to="/"
                        className="block text-gray-700 hover:text-red-600 transition duration-300"
                        onClick={() => setIsOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/about"
                        className="block text-gray-700 hover:text-red-600 transition duration-300"
                        onClick={() => setIsOpen(false)}
                    >
                        About
                    </Link>
                    <Link
                        to="/contact"
                        className="block text-gray-700 hover:text-red-600 transition duration-300"
                        onClick={() => setIsOpen(false)}
                    >
                        Contact
                    </Link>
                    {
                        isAuthenticated ? <Link
                            to="/login"
                            className="block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
                            onClick={() => localStorage.removeItem('token')}
                        >Sign Out</Link> : (
                            <div>
                                <Link
                                    to="/login"
                                    className="block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded transition duration-300"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )
                    }
                </div>
            )}
        </nav>
    );
};

export default Navbar;

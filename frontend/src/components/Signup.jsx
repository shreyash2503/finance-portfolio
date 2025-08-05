import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        // Replace with actual API call
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
            email: form.email,
            password: form.password
        })
        if (response.status === 201) {
            navigate("/login");
        } else {
            alert("Signup failed. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <form
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
                onSubmit={handleSignup}
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
                    Create Account
                </h2>

                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 mb-2 text-left">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                        placeholder="John Doe"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2 text-left">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 mb-2 text-left">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                        placeholder="********"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 mb-2 text-left">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                        placeholder="********"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                >
                    Sign Up
                </button>

                <p className="text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="text-red-600 hover:underline"
                        onClick={() => navigate("/login")}
                    >
                        Log in
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Signup;

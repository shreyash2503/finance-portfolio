import React, { useState } from "react";
import { Pencil } from "lucide-react"; // modern icon
import { Link } from "react-router-dom";

const HomePage = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [portfolioName, setPortfolioName] = useState("");
    const [portfolioDescription, setPortfolioDescription] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);

    const [portfolios, setPortfolios] = useState([
        { name: "Portfolio 1", description: "Details about this portfolio." },
        { name: "Portfolio 2", description: "Details about this portfolio." },
        { name: "Portfolio 3", description: "Details about this portfolio." },
        { name: "Portfolio 4", description: "Details about this portfolio." },
        { name: "Portfolio 5", description: "Details about this portfolio." },
        { name: "Portfolio 6", description: "Details about this portfolio." },
    ]);

    const togglePopup = (index = null) => {
        if (index !== null) {
            // editing
            setEditingIndex(index);
            setPortfolioName(portfolios[index].name);
            setPortfolioDescription(portfolios[index].description);
        } else {
            // creating
            setEditingIndex(null);
            setPortfolioName("");
            setPortfolioDescription("");
        }
        setShowPopup(true);
    };

    const savePortfolio = () => {
        if (editingIndex !== null) {
            // update
            const updated = [...portfolios];
            updated[editingIndex] = { name: portfolioName, description: portfolioDescription };
            setPortfolios(updated);
        } else {
            // create
            setPortfolios([...portfolios, { name: portfolioName, description: portfolioDescription }]);
        }
        setShowPopup(false);
    };

    const deletePortfolio = (index) => {
        if (window.confirm("Are you sure you want to delete this portfolio?")) {
            const updated = [...portfolios];
            updated.splice(index, 1);
            setPortfolios(updated);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col m-10">
            <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold mb-2 sm:mb-0">Your Portfolios</h1>
                    <button
                        onClick={() => togglePopup()}
                        className="bg-red-700 text-white px-4 py-2 rounded font-semibold hover:bg-red-800 transition"
                    >
                        + Add Portfolio
                    </button>
                </div>

                {/* PORTFOLIO GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {portfolios.map((portfolio, i) => (
                        <Link to={`/portfolio/1234`} key={i} className="group">
                            <div
                                key={i}
                                onMouseDown={(e) => {
                                    if (e.button === 1) { // mouse wheel click
                                        e.preventDefault();
                                        deletePortfolio(i);
                                    }
                                }}
                                className="relative bg-white p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transform hover:scale-[1.02] transition duration-300 text-center"
                            >
                                <h3 className="font-semibold text-lg mb-2">{portfolio.name}</h3>
                                <p className="text-sm text-gray-600">{portfolio.description}</p>
                                {/* Edit button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        togglePopup(i);
                                    }}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
                                    aria-label="Edit"

                                >
                                    <Pencil size={18} />
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            {/* POPUP */}
            {showPopup && (
                <div className="fixed inset-0 bg-transparent backdrop-blur-md flex justify-center items-center z-50">
                    <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg animate-fadeIn">
                        <h2 className="text-xl font-bold mb-4">
                            {editingIndex !== null ? "Update Portfolio" : "Create Portfolio"}
                        </h2>
                        <input
                            type="text"
                            placeholder="Portfolio Name"
                            value={portfolioName}
                            onChange={(e) => setPortfolioName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <textarea
                            placeholder="Description"
                            rows="3"
                            value={portfolioDescription}
                            onChange={(e) => setPortfolioDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-medium hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={savePortfolio}
                                className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;

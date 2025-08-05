import React, { useState, useEffect } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    BarChart, Bar
} from "recharts";
import { fetchStockNames } from "../utils/yahooFinanceApi"; // Import the API call function

export default function Dashboard() {
    const [selectedStock, setSelectedStock] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [transactionType, setTransactionType] = useState("BUY");
    const [quantity, setQuantity] = useState("");

    const mockPortfolioItems = [
        { stockName: "AAPL", boughtPrice: 150, currentPrice: 175 },
        { stockName: "TSLA", boughtPrice: 700, currentPrice: 620 },
        { stockName: "MSFT", boughtPrice: 240, currentPrice: 320 },
        { stockName: "GOOGL", boughtPrice: 130, currentPrice: 140 },
        { stockName: "NFLX", boughtPrice: 400, currentPrice: 420 },
        { stockName: "META", boughtPrice: 180, currentPrice: 230 },
        { stockName: "META", boughtPrice: 180, currentPrice: 230 },
        { stockName: "META", boughtPrice: 180, currentPrice: 230 },
        { stockName: "META", boughtPrice: 180, currentPrice: 230 },
        { stockName: "META", boughtPrice: 180, currentPrice: 230 },
    ];

    const lineChartData = [
        { date: "Mon", value: 120000 },
        { date: "Tue", value: 122500 },
        { date: "Wed", value: 121000 },
        { date: "Thu", value: 124000 },
        { date: "Fri", value: 125000 },
    ];


    const pieChartData = mockPortfolioItems.map(item => ({
        name: item.stockName,
        value: item.boughtPrice,
    }));

    const barChartData = mockPortfolioItems.map(item => ({
        name: item.stockName,
        profit: item.currentPrice - item.boughtPrice,
    }));

    const pieColors = ["#EF4444", "#DC2626", "#F87171", "#FB7185", "#F43F5E", "#E11D48"];

    const [stockSearch, setStockSearch] = useState("");
    const [stockSuggestions, setStockSuggestions] = useState([]);

    useEffect(() => {
        if (stockSearch) {
            fetchStockNames(stockSearch).then((data) => setStockSuggestions(data));
        } else {
            setStockSuggestions([]);
        }
    }, [stockSearch]);

    return (
        <div className="p-10 bg-gray-50 min-h-screen flex flex-col gap-6">

            {/* First Row - Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-lg font-semibold text-red-600 mb-2">Portfolio Value</h2>
                    <p className="text-2xl font-bold text-gray-800">$125,000</p>
                    <p className="text-sm text-gray-500 mt-1">Last updated 1 hour ago</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-lg font-semibold text-red-600 mb-2">Today's Change</h2>
                    <p className="text-2xl font-bold text-green-600">+3.2%</p>
                    <p className="text-sm text-gray-500 mt-1">Compared to yesterday</p>
                </div>

                {/* Add Portfolio Item Form */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-lg font-semibold text-red-600 mb-4">Add Portfolio Item</h2>
                    <form className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            className="border rounded px-3 py-2 focus:outline-red-500"
                            value={stockSearch}
                            onChange={(e) => setStockSearch(e.target.value)}
                            list="stock-suggestions"
                        />
                        <datalist id="stock-suggestions">
                            {stockSuggestions.map((stock, index) => (
                                <option key={index} value={stock} />
                            ))}
                        </datalist>
                        <input
                            type="number"
                            placeholder="Quantity"
                            className="border rounded px-3 py-2 focus:outline-red-500"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            className="border rounded px-3 py-2 focus:outline-red-500"
                        />
                        <button
                            type="submit"
                            className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 transition"
                        >
                            Add
                        </button>
                    </form>
                </div>
            </div>

            {/* Middle Row - Table + Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Portfolio Items Table */}
                <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto overflow-y-scroll h-100">
                    <h2 className="text-lg font-semibold text-red-600 mb-4">Portfolio Items</h2>
                    <table className="min-w-full border text-sm text-gray-700">
                        <thead className="bg-red-600 text-white">
                            <tr>
                                <th className="px-4 py-2 text-left">Stock Name</th>
                                <th className="px-4 py-2 text-left">Bought Price</th>
                                <th className="px-4 py-2 text-left">Current Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockPortfolioItems.map((item, index) => (
                                <tr
                                    key={index}
                                    className="even:bg-gray-50 hover:bg-gray-100 transition"
                                    onClick={() => {
                                        setSelectedStock(item);
                                        setShowModal(true);
                                    }}
                                >
                                    <td className="px-4 py-2">{item.stockName}</td>
                                    <td className="px-4 py-2">${item.boughtPrice}</td>
                                    <td className="px-4 py-2">${item.currentPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Line Chart */}
                <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-between">
                    <h2 className="text-lg font-semibold text-red-600 mb-4">Portfolio Over Time</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#DC2626" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-lg font-semibold text-red-600 mb-4">Stock Allocation</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                fill="#DC2626"
                                label
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Last Row - Bar Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="bg-white rounded-2xl shadow p-6 col-span-1">
                    <h2 className="text-lg font-semibold text-red-600 mb-4">Profit / Loss by Stock</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="profit" fill="#EF4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-2xl shadow p-6 col-span-1">
                    <h2 className="text-lg font-semibold text-red-600 mb-4">Allocation by Stock</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#EF4444"
                                label
                            />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Line Chart */}
                <div className="bg-white rounded-2xl shadow p-6 col-span-1">
                    <h2 className="text-lg font-semibold text-red-600 mb-4">Portfolio Value Over Time</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {showModal && selectedStock && (
                <div className="fixed inset-0 bg-transparent backdrop-blur-lg flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
                        <h3 className="text-lg font-semibold text-red-600 mb-4">
                            BUY/SELL {selectedStock.stockName}
                        </h3>

                        {/* Type Toggle */}
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full border rounded px-3 py-2 mb-4 focus:outline-red-500"
                        />
                        <div className="flex justify-between mb-4">
                            <button
                                className={`px-4 py-2 rounded ${transactionType === "BUY" ? "bg-red-600 text-white" : "bg-gray-200"}`}
                                onClick={() => setTransactionType("BUY")}
                            >
                                Buy
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${transactionType === "SELL" ? "bg-red-600 text-white" : "bg-gray-200"}`}
                                onClick={() => setTransactionType("SELL")}
                            >
                                Sell
                            </button>
                        </div>

                        {/* Quantity Input */}

                        {/* Submit + Cancel Buttons */}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Here you would call the backend buy/sell transaction API
                                    console.log(`${transactionType} ${quantity} of ${selectedStock.stockName}`);
                                    setShowModal(false);
                                    setQuantity("");
                                }}
                                className="px-4 py-2 rounded bg-red-600 text-white"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );
}

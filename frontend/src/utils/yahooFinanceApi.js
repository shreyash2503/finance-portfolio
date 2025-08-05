export async function fetchStockNames(query) {
    const response = await fetch(`https://api.yahoofinance2.com/search?q=${query}`);
    if (!response.ok) {
        throw new Error("Failed to fetch stock names");
    }
    const data = await response.json();
    console.log(data);
    return data.quotes.map((quote) => quote.symbol);
}

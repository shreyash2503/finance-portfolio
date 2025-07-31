const yahooFinance = require("yahoo-finance2").default;

async function fetchStockData(symbol, period1, period2, interval) {
  try {
    // Get current summary info
    const summary = await yahooFinance.quoteSummary(symbol, {
      modules: ["price", "summaryDetail"]
    });
    console.log(`📈 Stock Summary for ${symbol}:`);
    console.log(summary);

    // Get historical data
    const historicalData = await yahooFinance.historical(symbol, {
      period1: period1, // start date
      period2: period2, // end date
      interval: interval        // 1d, 1wk, 1mo
    });
    console.log(`\n📊 Historical Data for ${symbol}:`);
    console.log(historicalData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

// Example: Fetch for Apple (AAPL)
fetchStockData("AAPL", "2024-01-01", "2024-12-31", "1mo");
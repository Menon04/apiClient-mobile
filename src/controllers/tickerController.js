const tickerService = require('../services/tickerService');

class TickerController {
    async getQuote(req, res) {
        try {
            const { tickers } = req.params;
            const { range, interval, fundamental, dividends, modules } = req.query;
            
            const data = await tickerService.getQuote(tickers, {
                range,
                interval,
                fundamental,
                dividends,
                modules
            });
            
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async searchAndCreateTicker(req, res) {
        try {
            const { symbol } = req.params;
            const quoteData = await tickerService.getQuote(symbol);
            const ticker = await tickerService.findOrCreateTicker(quoteData.results[0]);
            
            res.json({
                ticker,
                quote: quoteData.results[0]
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TickerController();
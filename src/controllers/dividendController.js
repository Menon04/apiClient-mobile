const dividendService = require('../services/dividendService');

class DividendController {
    async processDividends(req, res) {
        try {
            const userId = req.user.id;
            const dividends = await dividendService.calculateAndPayDividends(userId);
            res.json({ message: 'Dividends processed successfully', dividends });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getDividendHistory(req, res) {
        try {
            const { portfolioId } = req.params;
            const dividends = await dividendService.getDividendHistory(portfolioId);
            res.json(dividends);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new DividendController();
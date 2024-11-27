const portfolioService = require('../services/portfolioService');
const transactionRepository = require('../models/transaction/transactionRepository');

class PortfolioController {
    async getPortfolio(req, res) {
        try {
            const userId = req.user.id;
            const portfolio = await portfolioService.getUserPortfolio(userId);
            res.json(portfolio);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async buyStock(req, res) {
        try {
            const { tickerId, quantity, price } = req.body;
            const userId = req.user.id;

            const result = await portfolioService.buyStock(
                userId,
                tickerId,
                quantity,
                price
            );

            res.status(200).json({
                message: 'Stock purchased successfully',
                portfolio: result
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async sellStock(req, res) {
        try {
            const { tickerId, quantity, price } = req.body;
            const userId = req.user.id;

            const result = await portfolioService.sellStock(
                userId,
                tickerId,
                quantity,
                price
            );

            res.status(200).json({
                message: 'Stock sold successfully',
                ...result
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getTransactions(req, res) {
        try {
            const userId = req.user.id;
            const transactions = await transactionRepository.getUserTransactions(userId);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PortfolioController();
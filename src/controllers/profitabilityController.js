const profitabilityService = require('../services/profitabilityService');

const profitabilityController = {
    async getMonthlyReturns(req, res) {
        try {
            const userId = req.user.id;
            const returns = await profitabilityService.calculateMonthlyReturns(userId);
            res.status(200).json(returns);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAnnualReturns(req, res) {
        try {
            const userId = req.user.id;
            const year = parseInt(req.query.year) || new Date().getFullYear();
            const returns = await profitabilityService.calculateAnnualReturns(userId, year);
            res.status(200).json(returns);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = profitabilityController;
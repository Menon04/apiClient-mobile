const Portfolio = require('./portfolio');
const Ticker = require('../ticker/ticker');

class PortfolioRepository {
    async findByUserAndTicker(userId, tickerId) {
        return await Portfolio.findOne({
            where: { userId, tickerId },
            include: [{ model: Ticker, as: 'ticker' }],
            lock: true
        });
    }

    async findByUserId(userId) {
        return await Portfolio.findAll({
            where: { userId },
            include: [{ model: Ticker, as: 'ticker' }]
        });
    }

    async createPortfolio(data, transaction) {
        return await Portfolio.create(data, { transaction });
    }

    async updatePortfolio(id, data, transaction) {
        const portfolio = await Portfolio.findByPk(id);
        if (!portfolio) throw new Error('Portfolio not found');
        return await portfolio.update(data, { transaction });
    }
}

module.exports = new PortfolioRepository();
const Dividend = require('./dividend');
const Portfolio = require('../portfolio/portfolio');
const Ticker = require('../ticker/ticker');

class DividendRepository {
    async createDividend(data, transaction) {
        return await Dividend.create(data, { transaction });
    }

    async findByPortfolioId(portfolioId) {
        return await Dividend.findAll({
            where: { portfolioId },
            include: [{
                model: Portfolio,
                as: 'portfolio',
                include: [{ model: Ticker, as: 'ticker' }]
            }],
            order: [['paymentDate', 'DESC']]
        });
    }

    async findOne(query) {
        return await Dividend.findOne(query);
    }
}

module.exports = new DividendRepository();
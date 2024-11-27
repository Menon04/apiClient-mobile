const dividendRepository = require('../models/dividend/dividendRepository');
const portfolioRepository = require('../models/portfolio/portfolioRepository');
const sequelize = require('../../infra/database');
const { Op } = require('sequelize');

class DividendService {
    generateDividendMultiplier() {
        return parseFloat((Math.random() * (1.72 - 0.4) + 0.6).toFixed(2));
    }

    async hasMonthlyDividend(portfolioId) {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const existingDividend = await dividendRepository.findOne({
            where: {
                portfolioId,
                paymentDate: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        return existingDividend;
    }

    async calculateAndPayDividends(userId) {
        const transaction = await sequelize.transaction();
        try {
            const portfolios = await portfolioRepository.findByUserId(userId);
            const dividendPayments = [];
            const currentDate = new Date();

            for (const portfolio of portfolios) {
                const existingDividend = await this.hasMonthlyDividend(portfolio.id);
                if (existingDividend) {
                    dividendPayments.push({
                        ticker: portfolio.ticker.symbol,
                        amount: existingDividend.amount,
                        multiplier: existingDividend.multiplier,
                        alreadyPaid: true
                    });
                    continue;
                }

                const multiplier = this.generateDividendMultiplier();
                const dividendAmount = parseFloat((portfolio.quantity * portfolio.averagePrice * multiplier / 100).toFixed(2));

                const dividend = await dividendRepository.createDividend({
                    portfolioId: portfolio.id,
                    amount: dividendAmount,
                    multiplier: multiplier,
                    paymentDate: currentDate
                }, transaction);

                dividendPayments.push({
                    ticker: portfolio.ticker.symbol,
                    amount: dividendAmount,
                    multiplier: multiplier,
                    alreadyPaid: false
                });
            }

            await transaction.commit();
            return dividendPayments;
        } catch (error) {
            await transaction.rollback();
            throw new Error('Error processing dividends: ' + error.message);
        }
    }

    async getDividendHistory(portfolioId) {
        return await dividendRepository.findByPortfolioId(portfolioId);
    }
}

module.exports = new DividendService();
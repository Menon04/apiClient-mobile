const Transaction = require('./transaction');
const Portfolio = require('../portfolio/portfolio');
const Ticker = require('../ticker/ticker');

class TransactionRepository {
    async createTransaction(data, transaction) {
        return await Transaction.create(data, { transaction });
    }

    async getUserTransactions(userId) {
        return await Transaction.findAll({
            where: { userId },
            include: [
                { 
                    model: Portfolio,
                    as: 'portfolio',
                    include: [{ model: Ticker, as: 'ticker' }]
                }
            ],
            order: [['transactionDate', 'DESC']]
        });
    }
}

module.exports = new TransactionRepository();
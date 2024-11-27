const portfolioRepository = require('../models/portfolio/portfolioRepository');
const userRepository = require('../models/user/userRepository');
const transactionRepository = require('../models/transaction/transactionRepository');
const { Transaction } = require('sequelize');
const sequelize = require('../../infra/database');

class PortfolioService {
    async getUserPortfolio(userId) {
        return await portfolioRepository.findByUserId(userId);
    }

    async buyStock(userId, tickerId, quantity, price) {
        const transaction = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
        });

        try {
            const user = await userRepository.findUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const totalCost = quantity * price;
            if (user.wallet < totalCost) {
                throw new Error('Insufficient funds');
            }

            const portfolio = await portfolioRepository.findByUserAndTicker(userId, tickerId);
            let updatedPortfolio;

            user.withdraw(totalCost);
            await user.save({ transaction });

            if (portfolio) {
                const newQuantity = portfolio.quantity + quantity;
                const newAveragePrice = ((portfolio.averagePrice * portfolio.quantity) + totalCost) / newQuantity;

                updatedPortfolio = await portfolioRepository.updatePortfolio(
                    portfolio.id,
                    {
                        quantity: newQuantity,
                        averagePrice: newAveragePrice
                    },
                    transaction
                );
            } else {
                updatedPortfolio = await portfolioRepository.createPortfolio({
                    userId,
                    tickerId,
                    quantity,
                    averagePrice: price
                }, transaction);
            }

            await transactionRepository.createTransaction({
                userId,
                portfolioId: updatedPortfolio.id,
                type: 'buy',
                price,
                quantity,
                transactionDate: new Date()
            }, transaction);

            await transaction.commit();
            return updatedPortfolio;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async sellStock(userId, tickerId, quantity, price) {
        const transaction = await sequelize.transaction();

        try {
            const portfolio = await portfolioRepository.findByUserAndTicker(userId, tickerId);
            if (!portfolio) {
                throw new Error('Stock not found in portfolio');
            }

            if (portfolio.quantity < quantity) {
                throw new Error('Insufficient stock quantity');
            }

            const totalValue = quantity * price;
            const user = await userRepository.findUserById(userId);

            portfolio.quantity -= quantity;
            await portfolio.save({ transaction });

            user.deposit(totalValue);
            await user.save({ transaction });

            await transactionRepository.createTransaction({
                userId,
                portfolioId: portfolio.id,
                type: 'sell',
                price,
                quantity,
                transactionDate: new Date()
            }, transaction);

            await transaction.commit();
            return { portfolio, soldValue: totalValue };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new PortfolioService();
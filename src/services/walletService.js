const sequelize = require('../../infra/database');
const userRepository = require('../models/user/userRepository');
const transactionRepository = require('../models/transaction/transactionRepository');

const walletService = {
    async deposit(email, amount) {
        const transaction = await sequelize.transaction();
        try {
            const user = await userRepository.findUserByEmail(email);
            if (!user) throw new Error('Usuário não encontrado');

            user.deposit(amount);
            await user.save({ transaction });

            await transactionRepository.createTransaction({
                userId: user.id,
                type: 'deposit',
                price: amount,
                transactionDate: new Date()
            }, transaction);

            await transaction.commit();
            return user;
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Erro ao realizar depósito: ${error.message}`);
        }
    },

    async withdraw(email, amount) {
        const transaction = await sequelize.transaction();
        try {
            const user = await userRepository.findUserByEmail(email);
            if (!user) throw new Error('Usuário não encontrado');

            user.withdraw(amount);
            await user.save({ transaction });

            await transactionRepository.createTransaction({
                userId: user.id,
                type: 'withdraw',
                price: amount,
                transactionDate: new Date()
            }, transaction);

            await transaction.commit();
            return user;
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Erro ao realizar saque: ${error.message}`);
        }
    },

    async getBalance(email) {
        try {
            const user = await userRepository.findUserByEmail(email);
            if (!user) throw new Error('Usuário não encontrado');
            
            return user.wallet;
        } catch (error) {
            throw new Error(`Erro ao consultar saldo: ${error.message}`);
        }
    }
};

module.exports = walletService;
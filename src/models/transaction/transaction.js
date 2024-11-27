const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../infra/database');
const Portfolio = require('../portfolio/portfolio');
const User = require('../user/user');

class Transaction extends Model {}

Transaction.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: () => require('uuid').v4(),
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    portfolioId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Portfolio,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    type: {
        type: DataTypes.ENUM('buy', 'sell', 'deposit', 'withdraw'),
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
        },
    },
    transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true,
});

Portfolio.hasMany(Transaction, { foreignKey: 'portfolioId', as: 'transactions' });
Transaction.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });

module.exports = Transaction;

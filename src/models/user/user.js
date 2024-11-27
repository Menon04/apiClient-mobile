const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../infra/database');
const { v4: uuidv4 } = require('uuid');

class User extends Model {
    deposit(amount) {
        if (amount > 0) {
            this.wallet += amount;
        } else {
            throw new Error('O valor do depósito deve ser positivo');
        }
    }

    withdraw(amount) {
        if (amount > 0 && amount <= this.wallet) {
            this.wallet -= amount;
        } else if (amount > this.wallet) {
            throw new Error('Saldo insuficiente');
        } else {
            throw new Error('O valor da retirada deve ser positivo');
        }
    }
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true
    },
    githubId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Nome inválido' }
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Sobrenome inválido' }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'Email inválido' }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: { args: [6], msg: 'A senha deve ter pelo menos 6 caracteres' }
        }
    },
    wallet: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
});

module.exports = User;

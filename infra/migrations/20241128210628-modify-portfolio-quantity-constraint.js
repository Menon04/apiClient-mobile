'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('portfolios_temp', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      tickerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tickers',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      averagePrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.sequelize.query(
      'INSERT INTO portfolios_temp SELECT * FROM portfolios;'
    );

    await queryInterface.dropTable('portfolios');
    
    await queryInterface.renameTable('portfolios_temp', 'portfolios');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('portfolios_temp', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      tickerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tickers',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1
        }
      },
      averagePrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.sequelize.query(
      'INSERT INTO portfolios_temp SELECT * FROM portfolios;'
    );

    await queryInterface.dropTable('portfolios');
    
    await queryInterface.renameTable('portfolios_temp', 'portfolios');
  }
};
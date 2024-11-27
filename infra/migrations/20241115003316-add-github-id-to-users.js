'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('stocks', 'userId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });
    await queryInterface.addIndex('stocks', ['userId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('stocks', ['userId']);
    await queryInterface.removeColumn('stocks', 'userId');
  }
};
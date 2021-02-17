'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "provider");
   
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("user", "provider", {
        type: Sequelize.BOOLEAN,
        default: false,
        allowNull: false,
    });
  },
};
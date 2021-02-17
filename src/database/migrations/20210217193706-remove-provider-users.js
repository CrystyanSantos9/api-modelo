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



module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("contacts", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: { model: "customers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable("contacts");
  },
};
"use strict"

const { DataType } = require("sequelize-typescript")

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.createTable("subscriptions", {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
      },
      email: {
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      city: {
        type: DataType.STRING,
        allowNull: false
      },
      frequency: {
        type: DataType.ENUM("daily", "hourly"),
        allowNull: false
      },
      isConfirmed: {
        type: DataType.BOOLEAN,
        defaultValue: false
      },
      confirmationToken: {
        type: DataType.STRING(64),
        allowNull: false,
        unique: true
      },
      unsubscribeToken: {
        type: DataType.STRING(64),
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: DataType.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataType.DATE,
        allowNull: false
      }
    })
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable("subscriptions")
  }
}

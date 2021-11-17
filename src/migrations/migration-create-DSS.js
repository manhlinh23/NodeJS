'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        // patientId: DataTypes.INTEGER,
        // doctorId: DataTypes.INTEGER,
        // description: DataTypes.STRING,
        await queryInterface.createTable('dsss', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            doctorId: {
                type: Sequelize.INTEGER
            },
            clinicId: {
                type: Sequelize.INTEGER
            },
            specialtyId: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('dsss');
    }
};
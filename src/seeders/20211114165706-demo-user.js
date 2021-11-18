'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'example@gmail.com',
      password: '123456',
      firstName: 'Nguyen',
      lastName: 'Manh Linh',
      address: 'Bac Ninh',
      gender: 1,
      roleId: 'R1',
      phonenumber: '0912345678',
      positionId: 'Doctor',
      image: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

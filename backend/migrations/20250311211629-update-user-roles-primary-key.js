'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Supprimer l'ancienne clé primaire
    await queryInterface.removeConstraint('user_roles', 'PRIMARY');

    // Ajouter une nouvelle clé primaire composite
    await queryInterface.addConstraint('user_roles', {
      fields: ['userId', 'roleId', 'permissionId'],
      type: 'primary key',
      name: 'user_roles_pkey',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revenir à l'ancienne configuration (optionnel)
    await queryInterface.removeConstraint('user_roles', 'user_roles_pkey');
    await queryInterface.addConstraint('user_roles', {
      fields: ['userId', 'roleId'],
      type: 'primary key',
      name: 'user_roles_pkey',
    });
  }
};
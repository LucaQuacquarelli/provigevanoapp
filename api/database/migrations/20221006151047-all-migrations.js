'use strict'

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('levels', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      name: {
        type: Sequelize.CHAR(20),
        allowNull: false
      },
      percentage: {
        type: Sequelize.TINYINT,
        allowNull: false
      }
    })
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      name: {
        type: Sequelize.CHAR(20),
        allowNull: false
      }
    })
    await queryInterface.createTable('languages', {
      id: {
        type: Sequelize.CHAR(2),
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.CHAR(10),
        allowNull: false
      }
    })
    await queryInterface.createTable('players', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.CHAR(50),
        allowNull: false
      },
      surname: {
        type: Sequelize.CHAR(50),
        allowNull: true
      },
      nick_name: {
        type: Sequelize.CHAR(50),
        allowNull: true,
        unique: true
      },
      birth_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      goalkeeper_provisory: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      level_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'levels',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      language_id: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'languages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('levels')
    await queryInterface.dropTable('roles')
    await queryInterface.dropTable('languages')
    await queryInterface.dropTable('players')
  }
}

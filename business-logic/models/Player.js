const Sequelize = require('sequelize');
// const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
    const Model = Sequelize.Model;

    class Player extends Model {
        static associate(models) {
            Player.belongsTo(models.Role);
            Player.belongsTo(models.Level);
            Player.belongsTo(models.Language);
        }
    }

    Player.init({
        id: {
            type: Sequelize.CHAR(36),
            primaryKey: true,
            allowNull: false,
            unique: true,
            // defaultValue: uuidv4() 
        },
        name: {
            type: Sequelize.CHAR(50),
            allowNull: false,
            // after: 'id'
        },
        surname: {
            type: Sequelize.CHAR(50),
            allowNull: true,
            // after: 'name'
        },
        nick_name: {
            type: Sequelize.CHAR(50),
            allowNull: true,
            // after: 'surname',
            unique: true,
        },
        birth_date: {
            type: Sequelize.DATEONLY,
            allowNull: true,
            // after: 'nick_name'
        },
        goalkeeper_provisory: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            // after: 'birth_date'
        },
        level_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            // after: 'goalkeeper_provisory',
            references: {
                model: 'levels',
                key: 'id',
            },
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            // after: 'level_id',
            references: {
                model: 'roles',
                key: 'id',
            },
        },
        language_id: {
            type: Sequelize.CHAR(2),
            allowNull: false,
            // after: 'role_id',
            references: {
                model: 'languages',
                key: 'id',
            }
        },
        available: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            // after: 'language_id'
        },
        created: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updated: {
            type: Sequelize.DATE,
            allowNull: false
        },
    }, {
        sequelize: sequelize,
        modelName: 'player',
        createdAt: 'created',
        updatedAt: 'updated'
    });

    return Player;
};
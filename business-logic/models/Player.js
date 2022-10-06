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
        },
        surname: {
            type: Sequelize.CHAR(50),
            allowNull: true,
        },
        nick_name: {
            type: Sequelize.CHAR(50),
            allowNull: true,
            unique: true,
        },
        birth_date: {
            type: Sequelize.DATEONLY,
            allowNull: true,
        },
        goalkeeper_provisory: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        level_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'levels',
                key: 'id',
            },
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'roles',
                key: 'id',
            },
        },
        language_id: {
            type: Sequelize.CHAR(2),
            allowNull: false,
            references: {
                model: 'languages',
                key: 'id',
            }
        },
        available: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
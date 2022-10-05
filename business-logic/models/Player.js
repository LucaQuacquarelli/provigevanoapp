const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Model = Sequelize.Model;

    class Player extends Model {
        static associate(models) {
            this.belongsTo(models.Role);
            this.belongsTo(models.Level);
            this.belongsTo(models.Language);
        }
    }

    Player.init({
        id: {
            type: Sequelize.CHAR(36),
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: Sequelize.CHAR(50),
            allowNull: false,
            after: 'id'
        },
        surname: {
            type: Sequelize.CHAR(50),
            allowNull: true,
            after: 'name'
        },
        nick_name: {
            type: Sequelize.CHAR(50),
            allowNull: true,
            after: 'surname'
        },
        birth_date: {
            type: Sequelize.DATE,
            allowNull: true,
            after: 'nick_name'
        },
        goalkeeper_provisory: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            after: 'birth_date'
        },
        level_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            after: 'goalkeeper_provisory',
            references: {
                model: 'levels',
                key: 'id',
            },
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            after: 'level_id',
            references: {
                model: 'roles',
                key: 'id',
            },
        },
        language_id: {
            type: Sequelize.CHAR(2),
            allowNull: false,
            after: 'level_id',
            references: {
                model: 'languages',
                key: 'id',
            },
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

    Player.sync({ alter: true });

    return Player;
};
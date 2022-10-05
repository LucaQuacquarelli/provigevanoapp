const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Model = Sequelize.Model;

    class Language extends Model { }

    Language.init({
        id: {
            type: Sequelize.CHAR(2),
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.CHAR(10),
            allowNull: false
        }

    }, {
        sequelize: sequelize,
        modelName: 'language',
        createdAt: false,
        updatedAt: false
    });

    Language.sync({ alter: true });

    return Language;
};
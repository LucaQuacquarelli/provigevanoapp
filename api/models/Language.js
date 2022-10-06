const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Model = Sequelize.Model;

    class Language extends Model {
        static associate(models) {
            Language.hasMany(models.Player);
        }
    }

    Language.init({
        id: {
            type: Sequelize.CHAR(2),
            primaryKey: true,
            allowNull: false,
            unique: true,
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

    return Language;
};
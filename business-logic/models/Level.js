const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Model = Sequelize.Model;

    class Level extends Model { 

        static associate(models) {
            this.hasMany(models.Player);
        }
    };
    Level.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.CHAR(20),
            allowNull: false,
            after: 'id'
        },
        percentage: {
            type: Sequelize.TINYINT,
            allowNull: false,
            after: 'name'
        },
    }, {
        sequelize: sequelize,
        modelName: 'level',
        createdAt: false,
        updatedAt: false
    });

    return Level;
};

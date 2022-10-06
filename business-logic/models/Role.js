const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Model = Sequelize.Model;

    class Role extends Model {
        static associate(models) {
            this.hasMany(models.Player);
        }
    };
    Role.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.CHAR(20),
            allowNull: false,
        },
    }, {
        sequelize: sequelize,
        modelName: 'role',
        createdAt: false,
        updatedAt: false
    });

    return Role;
};

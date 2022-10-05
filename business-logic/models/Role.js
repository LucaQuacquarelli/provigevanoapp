/*
 * Author: Luca QUACQUARELLI
 *
 * Created on Fri Jul 01 2022
 *
 * Copyright (c) 2022 Conduent Business Solutions Italia SPA
 *
 */

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Model = Sequelize.Model;

    class Role extends Model { };
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

    Role.sync({ alter: true });

    return Role;
};

/*
 * Author: Luca QUACQUARELLI
 *
 * Created on Fri Jul 01 2022
 *
 * Copyright (c) 2022 Conduent Business Solutions Italia SPA
 *
 */

const Sequelize = require('sequelize')

module.exports = (sequelize) => {
    const Model = Sequelize.Model

    class Role extends Model {}

    Role.init({
        name: {
            type: Sequelize.CHAR(20),
            primaryKey: true,
            allowNull: false
        }

    }, {
        sequelize: sequelize,
        modelName: 'roles',
        createdAt: false,
        updatedAt: false
    })

    return Role
}
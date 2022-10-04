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

    class Language extends Model {}

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
        modelName: 'languages',
        createdAt: false,
        updatedAt: false
    })

    return Language
}
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

    class Player extends Model {}

    Player.init({
        id: {
            type: Sequelize.CHAR(36),
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        google_id: {
            type: Sequelize.CHAR(100)
        },
        facebook_id: {
            type: Sequelize.CHAR(100)
        },
        surname: {
            type: Sequelize.CHAR(50),
            allowNull: false
        },
        name: {
            type: Sequelize.CHAR(50),
            allowNull: false
        },
        email: {
            type: Sequelize.CHAR(50),
            allowNull: false
        },
        email_confirmation_status: {
            type: Sequelize.CHAR(20),
            allowNull: false
        },
        password: {
            type: Sequelize.CHAR(100)
        },
        roles_name: {
            type: Sequelize.CHAR(20),
            allowNull: false
        },
        languages_id: {
            type: Sequelize.CHAR(2),
            allowNull: false
        },
        locales_id: {
            type: Sequelize.CHAR(5),
            allowNull: false
        },
        token: {
            type: Sequelize.CHAR
        },
        notify_ticket_issuance: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        created: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updated: {
            type: Sequelize.DATE,
            allowNull: false
        }

    }, {
        sequelize: sequelize,
        modelName: 'accounts',
        createdAt: 'created',
        updatedAt: 'updated'
    })

    return Player
}
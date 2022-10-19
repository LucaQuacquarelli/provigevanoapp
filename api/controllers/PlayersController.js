const Config = require('../Config')
const { Op } = require("sequelize")
var sequelize = Config.sequelize()
const { validationResult } = require('express-validator')
var ModelBase = require(`${__dirname}/../models/ModelBase`)(sequelize.pro())

/**
 ** Players CRUD
 */
module.exports.index = (req, res) => {
    ModelBase.Player.findAll({
        order: [
            // ['name', 'ASC']
            ['role_id', 'DESC']
        ],
        attributes: {exclude : ['level_id', 'role_id']} ,
        include: [
            {
                model: ModelBase.Level
            },
            {
                model: ModelBase.Role
            }
        ]
    })
    .then((player) => {
        res.send(player)
    })
}

module.exports.update = (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.send({
                errors: errors.errors
            })
        } else {
            ModelBase.Player.update({
                name: req.body.name,
                surname: req.body.surname,
                nick_name: req.body.nick_name,
                level_id: req.body.level_id,
            },{
                where: {
                    id: req.body.id
                }
            })
            .then(() => {
                res.send('update success')
            })
        }
    }

/**
 ** Players Endpoints
 */
module.exports.searchPlayers = (req, res) => {
    ModelBase.Player.findAll({
        order: [
            ['name', 'ASC']
        ],
        where: {
            [Op.or]: [
                {
                    name: { [Op.like]: `%${req.body.inputSearch}%` }
                },
                {
                    nick_name:{ [Op.like]: `%${req.body.inputSearch}%` } 
                } 
            ]
        },
        attributes: {exclude : ['level_id', 'role_id']} ,
        include: [
            {
                model: ModelBase.Level
            },
            {
                model: ModelBase.Role
            }
        ]
    })
    .then((player) => {
        res.send(player)
    })
}

module.exports.setAvailability= (req, res) => {
    ModelBase.Player.update({
        available: req.body.available
    },{
        where: {
            id: req.body.id
        }
    })
    .then(() => {
        res.end()
    })
}

module.exports.getByLevel = (req, res) => {
    ModelBase.Level.findAll({
        order: [
            ['id', 'DESC']
        ],
        attributes: {exclude : ['percentage']} ,
        include: {
            model: ModelBase.Player,
            where: {
                available: true
            },
            attributes: {exclude : ['level_id', 'role_id']} ,
            include: [
                {
                    model: ModelBase.Level,
                    attributes: ['percentage']
                },
                {
                    model: ModelBase.Role
                }
            ]
        }
    })
    .then((player) => {
        res.send(player)
    })
}
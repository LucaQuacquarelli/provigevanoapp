const Config = require('../Config')
const { Op } = require("sequelize")
var sequelize = Config.sequelize()
const { validationResult } = require('express-validator')
var ModelBase = require(`${__dirname}/../models/ModelBase`)(sequelize.pro())

/**
 ** Players CRUD
 */
module.exports.index = (req, res) => {

    const unavailables_players_counter = ModelBase.Player.count({
        where: {
            available: false
        }
    })

    const availables_players_counter = ModelBase.Player.count({
        where: {
            available: true
        }
    })

    const all_players = ModelBase.Player.findAll({
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

    Promise.all([all_players, unavailables_players_counter, availables_players_counter])
        .then((responses) => {
            const responsesObject = {
                all_players: responses[0],
                unavailables_players_counter: responses[1],
                availables_players_counter: responses[2],
            }
            res.send(responsesObject)
        })
        .catch((err) => {
            res.send(err)
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
            this.index(req, res)
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

module.exports.getCounters = (req, res) => {
    const unavailables_players_counter = ModelBase.Player.count({
        where: {
            available: false
        }
    })

    const availables_players_counter = ModelBase.Player.count({
        where: {
            available: true
        }
    })
    Promise.all([unavailables_players_counter, availables_players_counter])
        .then((responses) => {
            const responsesObject = {
                unavailables_players_counter: responses[0],
                availables_players_counter: responses[1],
            }
            res.send(responsesObject)
        })
        .catch((err) => {
            res.send(err)
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
        this.getCounters(req, res)
    })

}

module.exports.clearAvailability = (req, res) => {
    ModelBase.Player.update({
        available: false
    }, {
        where: {
            available: true
        }
    })
        .then(() => {
            this.index(req,res)
        });
}

module.exports.getByLevel = (req, res) => {
    const playersByLevel = ModelBase.Level.findAll({
        order: [
            ['id', 'DESC']
        ],
        attributes: {exclude : ['percentage']} ,
        include: {
            model: ModelBase.Player,
            where: {
                available: true,
                role_id:  1
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

    const countAllPlayersSelected = ModelBase.Player.count({
        where: {
            available: true
        }
    })

    const allGoalKeepersSelected = ModelBase.Player.findAll({
        order: [
            ['id', 'DESC']
        ],
        where: {
            available: true,
            role_id: 2
        },
        include: [
            {
                model: ModelBase.Level,
                attributes: ['percentage']
            },
            {
                model: ModelBase.Role
            }]
        })

    Promise.all([playersByLevel, countAllPlayersSelected, allGoalKeepersSelected])
        .then((responses) => {
            const responsesObject = {
                playersByLevel: responses[0],
                counterPlayersAvailables: responses[1],
                allGoalKeepersSelected: responses[2],
            }
            res.send(responsesObject)
        })
        .catch((err) => {
            res.send(err)
        })
}
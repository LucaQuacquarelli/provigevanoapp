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
    .then((players) => {
        res.send(players)
    })
}

module.exports.available_unavailable = (req, res) => {

    const all_players_availables = ModelBase.Player.findAll({
        where: {
            available: true
        },
        order: [
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
    const all_players_unavailables = ModelBase.Player.findAll({
        where: {
            available: false
        },
        order: [
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

    Promise.all([all_players_availables, all_players_unavailables])
        .then((responses) => {
            const responsesObject = {
                all_players_availables: responses[0],
                all_players_unavailables: responses[1]
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
    .then((players) => {
        var all_players_availables = []
        var all_players_unavailables = []
        players.forEach(
            player => {
                if (player.available) {
                    all_players_availables.push(player)
                } else {
                    all_players_unavailables.push(player)
                }
            }
        )
        res.send(
            {
                all_players_availables,
                all_players_unavailables
            }
        )
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

    const all_goal_keepers_counter = ModelBase.Player.count({
        where: {
            available: true,
            role_id: 2
        }
    })

    Promise.all([unavailables_players_counter, availables_players_counter, all_goal_keepers_counter])
        .then((responses) => {
            const responsesObject = {
                unavailables_players_counter: responses[0],
                availables_players_counter: responses[1],
                all_goal_keepers_counter: responses[2] 
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
        const indexUnavailables = ModelBase.Player.findAll({
            where: {
                available: false
            },
            order: [
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
        const indexAvailable = ModelBase.Player.findAll({
            where: {
                available: true
            },
            order: [
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
        const all_goal_keepers = ModelBase.Player.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
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

        Promise.all([indexUnavailables, indexAvailable, all_goal_keepers])
        .then((responses) => {
            const responsesObject = {
                all_players: responses[0],
                all_players_availables: responses[1],
                all_goal_keepers: responses[2],
            }
            res.send(responsesObject)
        })
        .catch((err) => {
            res.send(err)
        })
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
    })
}

module.exports.setGoalKeepersProvisory = (req, res) => {
    ModelBase.Player.update({
        goalkeeper_provisory: true
    }, {
        where: {
            id: req.body.id
        }
    })
    .then(() => {
        ModelBase.Player.findAll({
            where: {
                goalkeeper_provisory: true
            },
            order: [
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
        .then((players) => {
            res.send(players)
        })
    })
}

module.exports.clearGoalKeepersProvisory = (req, res) => {
    ModelBase.Player.update({
        goalkeeper_provisory: false
    }, {
        where: {
            goalkeeper_provisory: true
        }
    })
    .then(() => {
        res.end()
    })
}

module.exports.getByLevel = (req, res) => {
    const players_by_level = ModelBase.Level.findAll({
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

    const availables_players_counter = ModelBase.Player.count({
        where: {
            available: true
        }
    })

    const all_goal_keepers_selected = ModelBase.Player.findAll({
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

    Promise.all([players_by_level, availables_players_counter, all_goal_keepers_selected])
        .then((responses) => {
            const responsesObject = {
                players_by_level: responses[0],
                availables_players_counter: responses[1],
                all_goal_keepers_selected: responses[2],
            }
            res.send(responsesObject)
        })
        .catch((err) => {
            res.send(err)
        })
}
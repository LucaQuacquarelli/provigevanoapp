// const Config = require('../Config')
// var sequelize = Config.sequelize()
// var ModelBase = require(`${__dirname}/../models/ModelBase`)(sequelize.pro())


module.exports = (sequelize) => {
    var ModelBase = require('../models/ModelBase')(sequelize)
    
    class Player extends ModelBase.Player {
        all_players_availables() {
            return new Promise((resolve, reject) => {
                ModelBase.Player.findAll({
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
                .then((players) => {
                    resolve(players)
                })
            })
        }

        all_players_unavailables() {
            return new Promise((resolve, reject) => {
                ModelBase.Player.findAll({
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
                .then((players) => {
                    resolve(players)
                })
            })
        }

        all_goal_keepers() {
            return new Promise((resolve, reject) => {
                ModelBase.Player.findAll({
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
                        }
                    ]
                })
                .then((players) => {
                    resolve(players)
                })
            })

        }
    }
    return Player
}
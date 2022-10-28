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

        all_gk_and_provisory(){
            return new Promise((resolve, reject) => {
                resolve('pippo')
                // ModelBase.Player.findAll({
                //     where: {
                //         [Op.or]: [
                //             {
                //                 goalkeeper_provisory: true
                //             },
                //             {
                //                 role_id: 2
                //             }
                //         ]
                //     },
                //     order: [
                //         ['role_id', 'DESC']
                //     ],
                //     attributes: { exclude: ['level_id', 'role_id'] },
                //     include: [
                //         {
                //             model: ModelBase.Level
                //         },
                //         {
                //             model: ModelBase.Role
                //         }
                //     ]
                // })
                // .then((pippo) => {
                //     console.log("🚀 ~ file: ControllerBase.js ~ line 111 ~ Player ~ .then ~ pippo", pippo)
                //     resolve(pippo);
                // })
            })
        }

        all_players_availables_without_gk(){
            return new Promise((resolve, reject) => {
                ModelBase.Player.findAll({
                    where: {
                        [Op.or]: [
                            {
                                goalkeeper_provisory: false
                            },
                            {
                                role_id: 1
                            }
                        ]
                    },
                    attributes: { exclude: ['level_id', 'role_id'] },
                    include: [
                        {
                            model: ModelBase.Level
                        },
                        {
                            model: ModelBase.Role
                        }
                    ]
                })
                .then((pippo) => {
                    console.log('pippo');
                    console.log("🚀 ~ file: ControllerBase.js ~ line 140 ~ Player ~ .then ~ pippo", pippo)
                    resolve(pippo)
                })
            })
        }
    }
    return Player
}
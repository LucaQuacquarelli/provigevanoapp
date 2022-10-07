const Config = require('../Config');
var sequelize = Config.sequelize();
const { validationResult } = require('express-validator');
var ModelBase = require(`${__dirname}/../models/ModelBase`)(sequelize.pro());

module.exports.index = (req, res) => {
    ModelBase.Player.findAll({
        order: [
            ['name', 'ASC']
        ]
    })
        .then((player) => {
            res.send(player);
        });
};

/**
 * TODO
 */
// module.exports.update = (req, res) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         res.send({
//             errors: errors.errors
//         })
//     } else {
//         ModelBase.Player.findAll({
//             attributes: ['id']
//         })
//         .then((players_ids) => {
//              res.send(players_ids)
//         })
//     }
// }
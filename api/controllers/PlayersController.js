const Config = require('../Config')
const { Op } = require('sequelize')
const sequelize = Config.sequelize()
const { validationResult } = require('express-validator')
const ModelBase = require(`${__dirname}/../models/ModelBase`)(sequelize.pro())
const ControllerBase = require('./ControllerBase')(sequelize.pro())

const rolesInclude = [
  { model: ModelBase.Level },
  { model: ModelBase.Role },
  { model: ModelBase.Role, as: 'roles', through: { attributes: [] } }
]

const allPlayersQuery = () =>
  ModelBase.Player.findAll({
    order: [['role_id', 'DESC']],
    attributes: { exclude: ['level_id', 'role_id'] },
    include: rolesInclude
  })

/**
 ** Players CRUD
 */
module.exports.index = (req, res) => {
  allPlayersQuery()
    .then((players) => {
      res.send({ all_players: players })
    })
}

module.exports.create = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.errors })
  }

  const { name, surname, nick_name, level_id, role_id, roles } = req.body
  const now = new Date()

  ModelBase.Player.create({
    name,
    surname: surname || null,
    nick_name: nick_name || null,
    level_id,
    role_id: role_id || 1,
    language_id: 'es',
    available: false,
    goalkeeper_provisory: false,
    created: now,
    updated: now
  })
    .then(async (player) => {
      if (Array.isArray(roles) && roles.length > 0) {
        const entries = roles.map(rid => ({ player_id: player.id, role_id: rid }))
        await ModelBase.PlayerRole.bulkCreate(entries, { ignoreDuplicates: true })
      }
      return allPlayersQuery()
    })
    .then((players) => {
      res.send({ all_players: players })
    })
    .catch((err) => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).send({ errors: [{ msg: 'Nickname già in uso' }] })
      } else {
        res.status(500).send({ errors: [{ msg: err.message }] })
      }
    })
}

module.exports.destroy = (req, res) => {
  ModelBase.Player.destroy({ where: { id: req.params.id } })
    .then(() => allPlayersQuery())
    .then((players) => {
      res.send({ all_players: players })
    })
    .catch((err) => {
      res.status(500).send({ errors: [{ msg: err.message }] })
    })
}

module.exports.update = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.errors })
  }

  const { id, name, surname, nick_name, level_id, role_id, roles } = req.body

  ModelBase.Player.update({
    name,
    surname,
    nick_name,
    level_id,
    ...(role_id !== undefined ? { role_id } : {})
  }, { where: { id } })
    .then(async () => {
      if (Array.isArray(roles)) {
        await ModelBase.PlayerRole.destroy({ where: { player_id: id } })
        if (roles.length > 0) {
          const entries = roles.map(rid => ({ player_id: id, role_id: rid }))
          await ModelBase.PlayerRole.bulkCreate(entries, { ignoreDuplicates: true })
        }
      }
      return allPlayersQuery()
    })
    .then((players) => {
      res.send({ all_players: players })
    })
}

/**
 ** Players Endpoints
 */
module.exports.available_unavailable = (req, res) => {
  const oPlayer = new ControllerBase()
  Promise.all([oPlayer.all_players_availables(), oPlayer.all_players_unavailables()])
    .then((responses) => {
      res.send({
        all_players_availables: responses[0],
        all_players_unavailables: responses[1]
      })
    })
    .catch((err) => { res.send(err) })
}

module.exports.searchPlayers = (req, res) => {
  ModelBase.Player.findAll({
    order: [['name', 'ASC']],
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${req.body.inputSearch}%` } },
        { nick_name: { [Op.like]: `%${req.body.inputSearch}%` } }
      ]
    },
    attributes: { exclude: ['level_id', 'role_id'] },
    include: rolesInclude
  })
    .then((players) => {
      if (req.body.playersFiltered) {
        const all_players_availables = []
        const all_players_unavailables = []
        players.forEach(player => {
          if (player.available) {
            all_players_availables.push(player)
          } else {
            all_players_unavailables.push(player)
          }
        })
        res.send({ all_players_availables, all_players_unavailables })
      } else {
        res.send(players)
      }
    })
}

function normalizeStr(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

module.exports.matchNames = (req, res) => {
  const names = req.body.names
  if (!Array.isArray(names) || names.length === 0) {
    return res.send({ matched: [], unmatched: [], ambiguous: [], allPlayers: [] })
  }

  const fullQuery = ModelBase.Player.findAll({
    attributes: { exclude: ['level_id', 'role_id'] },
    include: rolesInclude
  })

  const allPlayersQuery2 = ModelBase.Player.findAll({
    attributes: ['id', 'name', 'nick_name'],
    order: [['nick_name', 'ASC']]
  })

  Promise.all([fullQuery, allPlayersQuery2])
    .then(([allPlayersWithDetails, allPlayers]) => {
      const matched = []
      const ambiguous = []
      const unmatched = []
      const usedPlayerIds = new Set()

      for (const name of names) {
        const nl = normalizeStr(name)
        const candidates = allPlayersWithDetails.filter(p =>
          (p.name && normalizeStr(p.name) === nl) ||
          (p.nick_name && normalizeStr(p.nick_name) === nl)
        )

        if (candidates.length === 0) {
          unmatched.push(name)
        } else if (candidates.length === 1) {
          if (!usedPlayerIds.has(candidates[0].id)) {
            matched.push(candidates[0])
            usedPlayerIds.add(candidates[0].id)
          }
        } else {
          // Multiple players share the same name/nickname — ask user to pick one
          ambiguous.push({ inputName: name, candidates })
        }
      }

      res.send({ matched, unmatched, ambiguous, allPlayers })
    })
    .catch((err) => {
      res.status(500).send({ errors: [{ msg: err.message }] })
    })
}

module.exports.setAvailableByNames = (req, res) => {
  const playerIds = req.body.playerIds
  if (!Array.isArray(playerIds)) {
    return res.status(400).send({ errors: [{ msg: 'playerIds required' }] })
  }

  ModelBase.Player.update({ available: false }, { where: {} })
    .then(() => {
      if (playerIds.length === 0) return
      return ModelBase.Player.update({ available: true }, { where: { id: { [Op.in]: playerIds } } })
    })
    .then(() => {
      const oPlayer = new ControllerBase()
      return Promise.all([oPlayer.all_players_availables(), oPlayer.all_players_unavailables()])
    })
    .then((responses) => {
      res.send({
        all_players_availables: responses[0],
        all_players_unavailables: responses[1]
      })
    })
    .catch((err) => {
      res.status(500).send({ errors: [{ msg: err.message }] })
    })
}

module.exports.setAvailability = (req, res) => {
  ModelBase.Player.update({
    available: req.body.available
  }, {
    where: { id: req.body.id }
  })
    .then(() => {
      const oPlayer = new ControllerBase()
      return Promise.all([oPlayer.all_players_availables(), oPlayer.all_players_unavailables()])
    })
    .then((responses) => {
      res.send({
        all_players_availables: responses[0],
        all_players_unavailables: responses[1]
      })
    })
    .catch((err) => { res.send(err) })
}

module.exports.clearAvailability = (req, res) => {
  ModelBase.Player.update({ available: false }, { where: { available: true } })
    .then(() => allPlayersQuery())
    .then((players) => {
      res.send({ all_players: players })
    })
}

module.exports.setGoalKeepersProvisory = (req, res) => {
  ModelBase.Player.update({
    goalkeeper_provisory: true
  }, {
    where: { id: req.body.id }
  })
    .then(() => {
      const oPlayer = new ControllerBase()
      return Promise.all([oPlayer.all_gk_and_provisory(), oPlayer.all_players_availables_without_gk()])
    })
    .then((responses) => {
      res.send({
        all_gk_and_provisory: responses[0],
        all_players_availables_without_gk: responses[1]
      })
    })
    .catch((err) => { res.send(err) })
}

module.exports.clearGoalKeepersProvisory = (req, res) => {
  ModelBase.Player.update({
    goalkeeper_provisory: false
  }, {
    where: { goalkeeper_provisory: true }
  })
    .then(() => {
      const oPlayer = new ControllerBase()
      return oPlayer.all_players_availables()
    })
    .then((players) => {
      res.send({ all_players_availables: players })
    })
    .catch((err) => { res.send(err) })
}

module.exports.getByLevel = (req, res) => {
  const players_by_level = ModelBase.Level.findAll({
    order: [['id', 'DESC']],
    attributes: { exclude: ['percentage'] },
    include: {
      model: ModelBase.Player,
      where: { available: true, role_id: 1 },
      attributes: { exclude: ['level_id', 'role_id'] },
      include: [
        { model: ModelBase.Level, attributes: ['percentage'] },
        { model: ModelBase.Role },
        { model: ModelBase.Role, as: 'roles', through: { attributes: [] } }
      ]
    }
  })

  const availables_players_counter = ModelBase.Player.count({
    where: { available: true }
  })

  const all_goal_keepers_selected = ModelBase.Player.findAll({
    order: [['id', 'DESC']],
    where: { available: true, role_id: 2 },
    include: [
      { model: ModelBase.Level, attributes: ['percentage'] },
      { model: ModelBase.Role },
      { model: ModelBase.Role, as: 'roles', through: { attributes: [] } }
    ]
  })

  Promise.all([players_by_level, availables_players_counter, all_goal_keepers_selected])
    .then((responses) => {
      res.send({
        players_by_level: responses[0],
        availables_players_counter: responses[1],
        all_goal_keepers_selected: responses[2]
      })
    })
    .catch((err) => { res.send(err) })
}

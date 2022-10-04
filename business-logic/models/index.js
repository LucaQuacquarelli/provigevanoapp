/*
 * Author: Luca QUACQUARELLI
 *
 * Created on Fri Jul 01 2022
 *
 * Copyright (c) 2022 Conduent Business Solutions Italia SPA
 *
 */


module.exports = (sequelize) => {
    var models = {
        Player: require('./Player')(sequelize),
        Language: require('./Language')(sequelize),
        Role: require('./Role')(sequelize)
    }

    return models
}
const sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define('users', {
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    }
});

//User.sync({force:true}); //o force, toda vida que voce pedir para criar a tabela, ele vai criar novamente, no false, isso nao acontece
module.exports = User;
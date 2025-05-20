const sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/category');


const Article = connection.define('articles', {
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false
    },
    body: {
        type: sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); //1 categoria tem n artigos
Article.belongsTo(Category); //pertence a - 1 Artigo pertence a 1 categoria. 1-1


module.exports = Article;
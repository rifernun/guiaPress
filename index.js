const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const connection = require('./database/database');
const categoriesController = require('./categories/categoriesController');
const articlesController = require('./articles/articlesController');
const Article = require('./articles/article');
const Category = require('./categories/category');

app.set('view engine', 'ejs');

//static
app.use(express.static('public')) //pasta onde fica os arquivos statics

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//database
connection
    .authenticate()
    .then(() => { //try
        console.log("Conexão feita com sucesso!");
    }).catch((error) => { //catch
        console.log(error);
    });

app.use("/", categoriesController);
app.use("/", articlesController);


app.get("/", (req,res) => {
    Article.findAll({
        order: [
            ['id','DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });  
    })
})

app.get("/:slug", (req,res) => {
    var slug = req.params.slug;
    Article.findOne({ 
        where: {
            slug: slug
    }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });  
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    })
})

app.get("/category/:slug", (req,res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => { //se achar a categoria, faz isso
        if(category != undefined){

            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories}); //acessando o foreign key com include (join)
            })

        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
})

app.listen(8080, () => {
    console.log("Servidor rodando!")
})
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const connection = require('./database/database');
const session = require('express-session');

const categoriesController = require('./categories/categoriesController');
const articlesController = require('./articles/articlesController');
const userController = require('./user/UsersController');

const Article = require('./articles/article');
const Category = require('./categories/category');
const User = require('./user/User');

app.set('view engine', 'ejs');

//sessions

//redis, para media e larga escala, evitando problemas 
app.use(session({
    secret: "qualquercoisa", //senha para decriptar suas sessoes com mais seguranca
    cookie: { //referencia para a sessao no servidor
        maxAge: 30000000 //desloga automaticamente apos certo periodo, em ms
    }
}))


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
app.use("/", userController);

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
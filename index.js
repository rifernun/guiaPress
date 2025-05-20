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
    res.render("index");
})

app.listen(8080, () => {
    console.log("Servidor rodando!")
})
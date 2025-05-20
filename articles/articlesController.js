const express = require('express')
const router = express.Router();

router.get("/articles", (req, res) => { //usar em arquivos que nao sao o principal
    res.send("Rota de artigos.")
})
router.get("/admin/articles/new", (req, res) => { //usar em arquivos que nao sao o principal
    res.send("Rota para criar um novo artigo.")
})

module.exports = router;
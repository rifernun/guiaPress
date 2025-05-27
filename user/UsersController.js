const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs')

router.get("/admin/users", (req,res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    })
})
router.get("/admin/users/create", (req,res) => {
    res.render("admin/users/create");
})

router.post("/user/create", (req,res) => {
    var email = req.body.email;
    var password = req.body.password;

    var salt = bcrypt.genSaltSync(10); //numero aleatorio para gerar o sal e "temperar" nosso hash de senha
    var hash = bcrypt.hashSync(password, salt) //passando a senha e o sal da senha para salvar o hash, ao inves da senha

    User.create({
        email: email,
        password: hash
    }).then(() => {
        res.redirect("/");
    }).catch(err => {
        res.redirect("/");
    })
    //res.json({email,password}); //sempre usar para testar, consegue descobrir onde esta errando apenas com uma linha!
})

module.exports = router;
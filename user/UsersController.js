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
    User.findOne({where:{
        email: email
    }}).then( user => {
        if(user == undefined){ //se o email nao tiver cadastrado, ai sim cria ele
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch(err => {
                res.redirect("/");
            })
        }else {
            res.redirect("/admin/users/create");
        }
    })
    //res.json({email,password}); //sempre usar para testar, consegue descobrir onde esta errando apenas com uma linha!
})

router.get("/login", (req,res) => {
    res.render("admin/users/login");
});

router.post("/authenticate", (req,res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user != undefined) { //se existe um usuario com esse email
            //validar senha
            var correct = bcrypt.compareSync(password,user.password); //se as hashs baterem, esta correta a senha
            if(correct) {
                req.session.user = {    
                    id: user.id,
                    email: user.email
                }
                res.json(req.session.user);
            }else {
                console.log("hash nao bateu");
                res.redirect("/login");
            }
        }else{
            console.log("user undefined");
            res.redirect("/login");
        }
    })
})

module.exports = router;
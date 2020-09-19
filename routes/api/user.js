const express = require("express");
const adminRouter = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("../../models/Users");
const User = mongoose.model("users");

// Create user
adminRouter.post("/users", (req, res) => {
    // Validation
    const { name, email, password } = req.body;
    const errors = [];

    if(!name || name !== String(name) || name.length < 4) {
        errors.push({text: "Nome inválido!"})
    }
    if(!email || email !== String(email) || email.length < 4) {
        errors.push({text: "Email inválido!"})
    }
    if(!password || password !== String(password) || password.length < 4) {
        errors.push({text: "Senha inválida!"})
    }
    if(errors.length > 0) {
        res.status(400);
        res.send({errors: errors});
    } else {
        User.findOne({email: req.body.email}).then(user => {
            if(user){
                res.send("Já existe uma conta com este email!");
            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password,
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) {
                            res.send("Erro ao salvar a senha!");
                        } 
                        newUser.password = hash;
                        newUser.save()
                            .then(() => {
                                res.send("Usuário cadastrado com sucesso!");
                            })
                            .catch(err => {
                                res.send("Erro ao cadastrar usuário, tente novamente!");
                            });
                    });
                });
            }
        });
    }
});

module.exports = adminRouter;
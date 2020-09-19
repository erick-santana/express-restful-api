const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWTSecret = "jcwxlvllcx";
require("./models/Users");
const User = mongoose.model("users");
const bcrypt = require("bcryptjs");
const book = require("./routes/api/book");
const user = require("./routes/api/user");

// Config
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/books", book); 
app.use("/users", user)

// MongoDB
try {
    mongoose.connect("your-mongodb-link", {useNewUrlParser: true});
    console.log("Conectado ao mongo");
} catch (error) {
    console.log("Erro ao se conectar ao mongo: " + error);
}

// Token Generate
app.post("/auth", (req, res) => {
    const { email, password } = req.body;

    if(email) {
        User.findOne({email: email}).then(user => {
            if(user) {
                bcrypt.compare(password, user.password, (err, equal) => {
                    if(equal) {
                        jwt.sign({id: user.id, email: user.email}, JWTSecret, {expiresIn: "24h"}, (err, token) => {
                            if(err) {
                                res.status(400);
                                res.json({err: "Falha interna"});
                            } else {
                                res.status(200);
                                res.json({token: token});
                            }
                        });
                    } else {
                        res.send("Senha incorreta!");
                    }
                });
            } else {
                res.status(404);
                res.json({err: "O email não existe"});
            }
        });
    } else {
        res.status(400);
        res.json({err: "Email inválido"});
    }
});

app.listen(process.env.PORT || 3000, () => console.log("API rodando!"));
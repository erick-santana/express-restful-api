const jwt = require("jsonwebtoken");
const JWTSecret = "jcwxlvllcx";

function auth(req, res, next) {
    const authToken = req.headers.authorization;
    if(authToken !== undefined) {
        const token = authToken.split(" ").pop();
        jwt.verify(token, JWTSecret, (err, data) => {
            if(err) {
                res.status(401);
                res.json({err: "Token iválido"});
            } else {
                req.token = token;
                req.loggedUser = { id: data.id, email: data.email };
                next();
            }
        });
    } else {
        res.status(401);
        res.json({err: "Token inválido"})
    }
}

module.exports = {
    auth
}
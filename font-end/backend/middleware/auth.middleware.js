const jwt = require('jsonwebtoken');
const pgConn = require("../config/db");

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err) {
                res.locals.user = null;
                res.cookie('jwt', '', {maxAge: 1});
                next();
            } else {
                pgConn.connect((err, db) => {
                    if(err){
                        console.log(err)
                        res.status(500).json({message: err});
                    } else {
                        const query = {
                            text: "SELECT * FROM utilisateur WHERE idUtilisateur = $1::integer",
                            values: [parseInt(decodedToken.id)],
                            rowMode: Array
                        }
                        db.query(query, (err, result) => {
                            if(err){
                                console.log(err)
                                res.status(500).json({message: err});
                            } else {

                                res.locals.user = result.rows[0];
                                next();
                            }
                        });
                    }
                })
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err) => {
            if (err) {
                res.sendStatus(401)
            } else {
                next();
            }
        });
    } else {
        res.sendStatus(401)
    }
};

module.exports.requireAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.sendStatus(401)
            } else {
                pgConn.connect((err, db) => {
                    if (err) {
                        console.log(err)
                        res.status(500).json({message: err});
                    } else {
                        const query = {
                            text: "SELECT isAdmin FROM utilisateur WHERE idUtilisateur = $1::integer",
                            values: [parseInt(decodedToken.id)],
                            rowMode: Array
                        }
                        db.query(query, (err, result) => {
                            if (err) {
                                console.log(err)
                                res.status(500).json({message: err});
                            } else {
                                if (result.rows[0].isadmin) {
                                    next();
                                } else {
                                    res.sendStatus(403);
                                }
                            }
                        });
                    }
                })
            }
        });
    }
}
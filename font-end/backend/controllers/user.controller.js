const crypto = require("node:crypto");
const pgConn = require("../config/db");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

module.exports.getAllUsers = async (req, res) => {
    try{
        await pgConn.connect((err, db) => {
            if(err){
                console.log(err)
                res.status(500).json({message: err});
            } else {
                const query = {
                    text: "SELECT idUtilisateur, pseudonyme FROM utilisateur",
                    rowMode: Array
                }
                db.query(query, (err, result) => {
                    if(err){
                        console.log(err)
                        res.status(500).json({message: err});
                    } else {
                        if(result.rows.length === 0){
                            res.status(200).json({message: "No data found"});
                        } else {
                            res.status(200).json(result.rows);
                        }
                    }
                });
            }
        })
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.getUserInfos = async (req, res) => {
    try {
        await pgConn.connect((err, db) => {
            if (err) {
                console.log(err)
                res.status(500).json({message: err});
            } else {
                const query = {
                    text: "SELECT idUtilisateur, pseudonyme, email FROM utilisateur WHERE idUtilisateur = $1::integer",
                    values: [parseInt(req.params.id)],
                    rowMode: Array
                }
                db.query(query, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(500).json({message: err});
                    } else {
                        if (result.rows.length === 0) {
                            res.status(404).json({message: "User not found"});
                        } else {
                            res.status(200).json(result.rows[0]);
                        }
                    }
                });
            }
        });
    } catch (err) {
        return res.status(500).json({message: err});
    }
}

module.exports.getMe = async (req, res) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err) {
                res.locals.user = null;
                res.cookie('jwt', '', {maxAge: 1});
                res.cookie('isLoggedIn', false, {maxAge: 1});
            } else {
                try {
                    await pgConn.connect((err, db) => {
                        if (err) {
                            console.log(err)
                            res.status(500).json({message: err});
                        } else {
                            const query = {
                                text: "SELECT idUtilisateur, pseudonyme, email FROM utilisateur WHERE idUtilisateur = $1::integer",
                                values: [parseInt(decodedToken.id)],
                                rowMode: Array
                            }
                            db.query(query, (err, result) => {
                                if (err) {
                                    console.log(err)
                                    res.status(500).json({message: err});
                                } else {
                                    if (result.rows.length === 0) {
                                        res.status(404).json({message: "User not found"});
                                    } else {
                                        res.status(200).json(result.rows[0]);
                                    }
                                }
                            });
                        }
                    });

                } catch (err) {
                    return res.status(500).json({message: err});
                }
            }
        });
    }
}

module.exports.updateUserInfos = async (req, res) => {

    try {
        const verifToken = crypto.randomBytes(20).toString('hex');
        await pgConn.connect(async (err, db) => {
            if (err) {
                console.log(err)
                res.status(500).json({message: err});
            } else {
                let queryText = "UPDATE utilisateur SET ";
                let cryptedPassword = "";
                let valuesList = [];
                let i = 1;
                if (req.body.email) {
                    queryText += `email = $${i.toString()}::varchar, `;
                    i += 1;
                    valuesList.push(req.body.email);
                }
                if (req.body.pseudonyme) {
                    queryText += `pseudonyme = $${i.toString()}::varchar, `;
                    i += 1;
                    valuesList.push(req.body.pseudonyme);
                }
                if (req.body.password) {
                    queryText += `password = $${i.toString()}::varchar `;
                    i += 1;
                    const salt = await bcrypt.genSalt();
                    cryptedPassword = await bcrypt.hash(req.body.password, salt);
                    valuesList.push(cryptedPassword);
                }
                queryText += `isVerified = $${i}::boolean, `;
                i += 1;
                queryText += `verificationToken = $${i}::varchar WHERE `;
                i += 1;
                queryText += `idUtilisateur = $${i}::integer`;
                valuesList.push(false, verifToken, parseInt(req.params.id));
                const query = {
                    text: queryText,
                    values: valuesList,
                    rowMode: Array
                }
                db.query(query, (err, ) => {
                    if (err) {
                        console.log(err)
                        res.status(500).json({message: err});
                    } else {
                        res.status(200).json({message: "User updated successfully"});
                    }
                });
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.updateMe = async (req, res) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', {maxAge: 1});
                res.cookie('isLoggedIn', false, {maxAge: 1});
            } else {
                try{
                    const verifToken = crypto.randomBytes(20).toString('hex');
                    await pgConn.connect(async (err, db) => {
                        if(err){
                            console.log(err)
                            res.status(500).json({message: err});
                        } else {
                            let queryText = "UPDATE utilisateur SET ";
                            let cryptedPassword = "";
                            let valuesList = [];
                            let i = 1;
                            if (req.body.email) {
                                queryText += `email = $${i.toString()}::varchar, `;
                                i += 1;
                                valuesList.push(req.body.email);
                            }
                            if (req.body.pseudonyme) {
                                queryText += `pseudonyme = $${i.toString()}::varchar, `;
                                i += 1;
                                valuesList.push(req.body.pseudonyme);
                            }
                            if (req.body.password) {
                                queryText += `password = $${i.toString()}::varchar, `;
                                i += 1;
                                const salt = await bcrypt.genSalt();
                                cryptedPassword = await bcrypt.hash(req.body.password, salt);
                                valuesList.push(cryptedPassword);
                            }
                            queryText += `isVerified = $${i}::boolean, `;
                            i += 1;
                            queryText += `verificationToken = $${i}::varchar WHERE `;
                            i += 1;
                            queryText += `idUtilisateur = $${i}::integer`;
                            valuesList.push(false, verifToken, parseInt(decodedToken.id));
                            console.log(queryText);
                            const query = {
                                text: queryText,
                                values: valuesList,
                                rowMode: Array
                            }
                            db.query(query, (err, ) => {
                                if(err){
                                    console.log(err)
                                    res.status(500).json({message: err});
                                } else {
                                    res.status(200).json({message: "User updated successfully"});
                                }
                            });
                        }
                    });
                } catch (err) {
                    return res.status(500).json({ message: err });
                }
            }
        });
    }
}

module.exports.deleteUser = async (req, res) => {
    try {
        await pgConn.connect((err, db) => {
            if (err) {
                console.log(err)
                res.status(500).json({message: err});
            } else {
                const query = {
                    text: "DELETE FROM utilisateur WHERE idUtilisateur = $1::integer",
                    values: [parseInt(req.params.id)],
                    rowMode: Array
                }
                db.query(query, (err, ) => {
                    if (err) {
                        console.log(err)
                        res.status(500).json({message: err});
                    } else {
                        res.status(200).json({message: "User deleted successfully"});
                    }
                });
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

module.exports.deleteMe = async (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', {maxAge: 1});
                res.cookie('isLoggedIn', false, {maxAge: 1});
            } else {
                try {
                    await pgConn.connect(async (err, db) => {
                        if (err) {
                            console.log(err)
                            res.status(500).json({message: err});
                        } else {
                            const query = {
                                text: "DELETE FROM utilisateur WHERE idUtilisateur = $1::integer",
                                values: [parseInt(decodedToken.id)],
                                rowMode: Array
                            }
                            db.query(query, (err, ) => {
                                if (err) {
                                    console.log(err)
                                    res.status(500).json({message: err});
                                } else {
                                    res.status(200).json({message: "User deleted successfully"});
                                }
                            });
                        }
                    });
                } catch (err) {
                    return res.status(500).json({message: err});
                }
            }

        });
    }
}
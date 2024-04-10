const pgConn = require("../config/db");
const jwt = require("jsonwebtoken");

module.exports.getCourses = (req, res) => {
    try {
        pgConn.connect((err, db) => {
            if (err) {
                console.log(err);
                res.status(500).json({message: err});
            } else {
                const query = {
                    text: "SELECT * FROM Cours",
                    rowMode: Array
                }
                db.query(query, (err, result) => {
                    if (err) {
                        res.status(500).json({message: err});
                    } else {
                        res.status(200).json({courses: result.rows});
                    }
                });
            }
        });
    } catch (err) {
        res.status(400).json({error: err});
    }
}

module.exports.getMyCreatedCourses = (req, res) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', {maxAge: 1});
                res.cookie('isLoggedIn', false, {maxAge: 1});
            } else {
                try {
                    pgConn.connect((err, db) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({message: err});
                        } else {
                            const query = {
                                text: "SELECT * FROM Cours WHERE idutilisateur = $1::integer",
                                values: [decodedToken.id],
                                rowMode: Array
                            }
                            db.query(query, (err, result) => {
                                if (err) {
                                    res.status(500).json({message: err});
                                } else {
                                    res.status(200).json({courses: result.rows});
                                }
                            });
                        }
                    });
                } catch (err) {
                    res.status(400).json({error: err});
                }
            }
        });
    } else {
        res.locals.user = null;
        res.cookie('jwt', '', {maxAge: 1});
        res.cookie('isLoggedIn', false, {maxAge: 1});
    }
}

module.exports.getMyFollowedCourses = (req, res) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', {maxAge: 1});
                res.cookie('isLoggedIn', false, {maxAge: 1});
            } else {
                try {
                    pgConn.connect((err, db) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({message: err});
                        } else {
                            const query = {
                                text: "SELECT * FROM Cours WHERE idcours IN (SELECT idcours FROM Suivre WHERE idutilisateur = $1::integer)",
                                values: [decodedToken.id],
                                rowMode: Array
                            }
                            db.query(query, (err, result) => {
                                if (err) {
                                    res.status(500).json({message: err});
                                } else {
                                    res.status(200).json({courses: result.rows});
                                }
                            });
                        }
                    });
                } catch (err) {
                    res.status(400).json({error: err});
                }
            }
        });
    } else {
        res.locals.user = null;
        res.cookie('jwt', '', {maxAge: 1});
        res.cookie('isLoggedIn', false, {maxAge: 1});
    }
}

module.exports.getAvailableCourses = (req, res) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', {maxAge: 1});
                res.cookie('isLoggedIn', false, {maxAge: 1});
            } else {
                try {
                    pgConn.connect((err, db) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({message: err});
                        } else {
                            const query = {
                                text: "SELECT DISTINCT c.idCours, c.libelle FROM utilisateur u JOIN user_groupe ug ON u.idUtilisateur = ug.idUtilisateur JOIN groupe g ON ug.idGroupe = g.idGroupe JOIN disponible_pour dp ON g.idGroupe = dp.idGroupe JOIN cours c ON dp.idCours = c.idCours WHERE u.idUtilisateur = $1::integer)",
                                values: [decodedToken.id],
                                rowMode: Array
                            }
                            db.query(query, (err, result) => {
                                if (err) {
                                    res.status(500).json({message: err});
                                } else {
                                    res.status(200).json({courses: result.rows});
                                }
                            });
                        }
                    });
                } catch (err) {
                    res.status(400).json({error: err});
                }
            }
        });
    } else {
        res.locals.user = null;
        res.cookie('jwt', '', {maxAge: 1});
        res.cookie('isLoggedIn', false, {maxAge: 1});
    }

}

module.exports.followCourse = (req, res) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', {maxAge: 1});
                res.cookie('isLoggedIn', false, {maxAge: 1});
            } else {
                try {
                    pgConn.connect((err, db) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({message: err});
                        } else {
                            const query = {
                                text: "INSERT INTO Suivre (idutilisateur, idcours) VALUES ($1::integer, $2::integer)",
                                values: [decodedToken.id, req.body.idCours]
                            }
                            db.query(query, (err, result) => {
                                if (err) {
                                    res.status(500).json({message: err});
                                } else {
                                    res.status(201).json({message: "Course followed"});
                                }
                            });
                        }
                    });
                } catch (err) {
                    res.status(400).json({error: err});
                }
            }
        });
    } else {
        res.locals.user = null;
        res.cookie('jwt', '', {maxAge: 1});
        res.cookie('isLoggedIn', false, {maxAge: 1});
    }
}

module.exports.createMyCourse = (req, res) => {
    res.sendStatus(500);
}

module.exports.updateMyCourse = (req, res) => {
    res.sendStatus(500);
}

module.exports.deleteMyCourse = (req, res) => {
    res.sendStatus(500);
}
const crypto = require("node:crypto");
const jwt = require('jsonwebtoken');
const { createTransport } = require('nodemailer');
const pgConn = require("../config/db");
const bcrypt = require("bcrypt");

const maxAge = 1000 * 60 * 60 * 24

const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,  {
        expiresIn: maxAge
    })
}

module.exports.signUp = async (req, res) => {
    const {pseudonyme, email, password} = req.body;
    const verifToken = crypto.randomBytes(20).toString('hex');
    const salt = await bcrypt.genSalt();
    const cryptedPassword = await bcrypt.hash(password, salt);
    try {
        pgConn.connect((err, db) => {
            if (err) {

                res.status(500).json({message: err});
            } else {
                console.log("PASSED")
                const query = {
                    text: "INSERT INTO Utilisateur VALUES (DEFAULT, $1::varchar, $2::varchar, $3::varchar, $4::boolean, $5::varchar, $6::boolean)",
                    values: [email, pseudonyme, cryptedPassword, false, verifToken, false],
                    rowMode: Array
                }
                db.query(query, (err,) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({message: err});
                    } else {
                        const query2 = {
                            text: "SELECT idUtilisateur FROM Utilisateur WHERE email = $1::varchar",
                            values: [email],
                            rowMode: Array
                        }
                        db.query(query2, (err, result) => {
                            if (err) {
                                res.status(500).json({message: err});
                            } else {
                                const mailOptions = {
                                    from: process.env.SMTP_USER,
                                    to: email,
                                    subject: 'Account verification',
                                    text: `Please click the following link to verify your account: http://localhost:3000/api/user/validate/${result.rows[0].idutilisateur}/${verifToken}`
                                }
                                transporter.sendMail(mailOptions, (err,) => {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).json({message: err});
                                    } else {
                                        res.status(201).json({user: result.rows[0].idutilisateur});
                                    }
                                });
                            }
                        });
                    }
                })
            }
        });
    } catch (err) {
        res.status(400).json({error: err});
    }
}

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        pgConn.connect((err, db) => {
            if (err) {
                console.log(err)
                res.status(500).json({message: err});
            } else {
                const query = {
                    text: "SELECT * FROM Utilisateur WHERE email = $1::varchar",
                    values: [email],
                    rowMode: Array
                }
                db.query(query, async (err, result) => {
                    if (err) {
                        res.status(500).json({message: err});
                    } else {
                        if (result.rows.length === 0) {
                            res.status(401).json({message: "Invalid email"});
                        } else {
                            const auth = await bcrypt.compare(password, result.rows[0].password);
                            if (auth) {
                                const token = createToken(result.rows[0].idutilisateur);
                                res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge});
                                res.cookie('isLoggedIn', true, {maxAge: maxAge})
                                res.status(200).json({user: result.rows[0].idutilisateur});
                            } else {
                                res.status(401).json({message: "Invalid password"});
                            }
                        }
                    }
                });
            }
        });
    } catch (err){
        res.status(400).json({ err: err });
    }
}

module.exports.signOut = (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, maxAge: 1 });
    res.cookie('isLoggedIn', false, {maxAge: 1});
    res.status(200).json({ message: "User successfully logged out" });
}

module.exports.validateAccount = async (req, res) => {
    const { userId, token } = req.params;
    try {
        pgConn.connect((err, db) => {
            if (err) {
                console.log(err)
                res.status(500).json({message: err});
            } else {
                const query = {
                    text: "SELECT * FROM Utilisateur WHERE idUtilisateur = $1::integer",
                    values: [parseInt(userId)],
                    rowMode: Array
                }
                db.query(query, (err, resultq1) => {
                    if (err) {
                        res.status(500).json({message: err});
                    } else {
                        if (resultq1.rows[0].verificationtoken === token) {
                            const query2 = {
                                text: "UPDATE Utilisateur SET isVerified = true, verificationToken = Null WHERE idUtilisateur = $1::integer",
                                values: [parseInt(userId)],
                                rowMode: Array
                            }
                            db.query(query2, (err, ) => {
                                if (err) {
                                    res.status(500).json({message: err});
                                } else {
                                    res.status(200).json({message: "Account verified"});
                                }
                            });
                        } else {
                            res.status(401).json({message: "Invalid token"});
                        }
                    }
                });
            }
        })
    } catch (err) {
        res.status(400).json({error: err});
    }
}
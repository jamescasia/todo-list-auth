const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let User = require("../models/user.model");

const TOKEN_DURATION = "2m";

router.route("/signup").post(async(req, res) => {
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ username, password });

    newUser
        .save()
        .then(() => {
            const token = jwt.sign({ username }, process.env.DB_AUTH_KEY, {
                expiresIn: TOKEN_DURATION,
            });

            res.json({ token });
        })
        .catch((error) => res.status(400).send({ error }));
});

router.route("/login").post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username })
        .then((user) => {
            console.log(user);
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ username }, process.env.DB_AUTH_KEY, {
                        expiresIn: TOKEN_DURATION,
                    });

                    res.json({ token });
                } else {
                    console.log("Wrong password or username.");
                    res.json("Wrong password or username.");
                }
            });
        })
        .catch((error) => res.status(400).send({ error }));
});

router.route("/logout").post((req, res) => {
    const token = jwt.sign({ exp: 0 }, process.env.DB_AUTH_KEY);
    res.status(200).json({ token });
});

router.route("/validtoken").post((req, res) => {
    jwt.verify(req.body.token, process.env.DB_AUTH_KEY, (error, decoded) => {
        if (decoded) {
            res.json({ valid: true });
        } else {
            res.json({ valid: false });
        }
    });
});

router.route("/refresh").post((req, res) => {
    jwt.verify(req.body.token, process.env.DB_AUTH_KEY, (error, decoded) => {
        if (decoded) {
            const username = decoded.username;
            const token = jwt.sign({ username }, process.env.DB_AUTH_KEY, {
                expiresIn: TOKEN_DURATION,
            });

            res.json({ token });
        } else {
            res.status(200).json({ error });
        }
    });
});

module.exports = router;
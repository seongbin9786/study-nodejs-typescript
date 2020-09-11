var express = require('express');
var router = express.Router();

const JwtPublisher = require('../auth/JwtPublisher');

var User = require('../models/User');

router.post('/', (req, res, next) => {
    const { email, password, name } = req.body;
    User.findOne({ email }, (err, check) => {
        if (check) {
            res.status(400).send('Duplicate Email');
            return;
        }
        if (err) {
            res.status(500).send('Uncaught errors occurred while register');
            return;
        }
        const user = new User({ email, password, name });
        user.save((err, { id, email, name }) => {
            if (err) {
                res.status(500).send('Uncaught errors occurred while register');
                return;
            }
            res.json({
                id,
                email,
                name,
                token: JwtPublisher(id)
            });
        });
    });
});

module.exports = router;
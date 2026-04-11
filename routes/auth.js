const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required !' });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'insert into users (username , password) values (?,?)';
    db.query(query, [username, hashedPassword], (err, results) => {
        if (err) {
            res.status(400).json({ error: 'Username already exist !' });
            return;
        }
        res.status(200).json({ message: 'User regestration successfull !' });
    });

});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required !' });
        return;
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err || results.length == 0) {
            res.status(401).json({ error: 'Invalid username or password !' });
            return;
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            res.status(401).json({ error: 'Invalid Username or Password !' });
            return;
        }
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ message: 'Log in successful ! ', token: token });
    })
});

module.exports = router;
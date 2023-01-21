const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data }
}
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const { uname, pwd } = req.body;

    if (!uname || !pwd) {
        return res.status(400).json({ message: 'Username and password are required' });
    };

    const foundUser = usersDB.users.find( usr => usr.userName === uname );

    if (!foundUser) {
        return res.sendStatus(401);
    };

    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.passWord);

    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { userName: foundUser.userName },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { userName: foundUser.userName },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        res.json({ success: `User ${uname} is logged in!` });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };
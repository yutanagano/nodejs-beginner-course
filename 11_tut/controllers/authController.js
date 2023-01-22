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
        // Saving refresh token with current user
        const otherUsers = usersDB.users.filter(person => person.userName !== foundUser.userName)
        const currentUser = { ...foundUser, refreshToken }
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };
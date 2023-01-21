const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data }
}
const fsPromises = require('fs').promises
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { uname, pwd } = req.body;

    if (!uname || !pwd) {
        return res.status(400).json({ message: 'Username and password are required' });
    };

    // Check for duplicate usernames in DB
    const duplicate = usersDB.users.find(usr => usr.userName === uname);

    if (duplicate) {
        return res.sendStatus(409);
    };

    try {
        // hash the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // store the new user
        const newUser = { userName: uname, passWord: hashedPwd };
        usersDB.setUsers([...usersDB.users, newUser]);

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        console.log(usersDB.users);

        res.status(201).json({ success: `New user ${newUser.userName} created` });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { handleNewUser };
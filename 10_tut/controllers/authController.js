const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data }
}
const bcrypt = require('bcrypt');

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
        // TODO create JWTs
        res.json({ success: `User ${uname} is logged in!` });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };
const { User } = require('../models/User');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.getUsersById(req.params.id)[0];
        res.status(200).send('user', { user: user });
    } catch (err) {
        res.status(500).send(err);
    }
};

const createUser = async (req, res) => {
    try {
        const { name, surname, password, age, sex } = req.body;
        const user = new User(name, surname, password, age, sex);
        await user.insertUser();
        res.status(201).send(user);
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.getUsersById(req.params.id)[0];
        if (user) {
            await user.deleteUser();
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    getUserProfile,
    createUser,
    deleteUser,
}
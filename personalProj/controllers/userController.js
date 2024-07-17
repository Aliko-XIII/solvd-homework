const { User } = require('../models/User');

const getUser = async (req, res) => {
    try {
        const user = await User.getUserById(req.params.id);
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send(err);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getUsers();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err);
    }
};

const createUser = async (req, res) => {
    try {
        const { name, surname, password, age, sex, phone } = req.body;
        const user = new User(name, surname, phone, password, age, sex);
        await user.insertUser();
        res.status(201).send(user);
    } catch (err) {
        res.status(500).send(err);
    }
};


const deleteUser = async (req, res) => {
    try {
        const user = await User.getUserById(req.params.id);
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
    getUser,
    createUser,
    deleteUser,
    getAllUsers,
}
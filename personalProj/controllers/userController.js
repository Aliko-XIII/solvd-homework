const { User } = require('../models/User');

/**
 * Handles the request to get a user by their ID.
 */
const getUser = async (req, res) => {
    try {
        const user = await User.getUserById(req.params.id);
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send(err);
    }
};

/**
 * Handles the request to get all users.
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.getUsers();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err);
    }
};

/**
 * Handles the request to create a new user.
 */
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

/**
 * Handles the request to delete a user by their ID.
 */
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

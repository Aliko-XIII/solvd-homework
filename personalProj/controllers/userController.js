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
        const { firstName, lastName, phone, password, age, sex} = req.body;
        const user = new User(firstName, lastName, phone, password, age, sex);
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

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phone, password, age, sex } = req.body;
        console.log(req.body);

        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Validate inputs (this can be more sophisticated based on your needs)
        if (firstName && typeof firstName !== 'string') return res.status(400).json({ error: 'Invalid first name' });
        if (lastName && typeof lastName !== 'string') return res.status(400).json({ error: 'Invalid last name' });
        if (phone && typeof phone !== 'string') return res.status(400).json({ error: 'Invalid phone number' });
        if (password && typeof password !== 'string') return res.status(400).json({ error: 'Invalid password' });
        if (age && (typeof age !== 'number' || age <= 0)) return res.status(400).json({ error: 'Invalid age' });
        if (sex && !['F', 'M'].includes(sex)) return res.status(400).json({ error: 'Invalid sex' });

        await User.updateUser(id, { firstName, lastName, phone, password, age, sex });

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the user' });
    }
};

module.exports = {
    getUser,
    createUser,
    deleteUser,
    getAllUsers,
    updateUser
}

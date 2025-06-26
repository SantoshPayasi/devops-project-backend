const express = require('express');
const cors = require('cors');
const { User, sequelize } = require('./models');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create user
app.post('/users', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        await user.update({ name, email, password });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        await user.destroy();
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
sequelize.authenticate().then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
}); 
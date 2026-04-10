const express = require('express');
const db = require('./db');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api',taskRoutes);
app.use(express.static('frontend'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

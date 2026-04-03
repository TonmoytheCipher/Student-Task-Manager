const express = require('express');
const db = require('./db');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = 3000;

 
app.use(express.json());
app.use('/api',taskRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

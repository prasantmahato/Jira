// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Adjust to your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }));


app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Task Manager API' });
});

app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
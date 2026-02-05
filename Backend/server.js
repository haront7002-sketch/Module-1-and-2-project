const express = require('express');
const cors = require('cors'); 
const pool = require('./database');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/employees_info', (req, res) => {
    pool.query('SELECT * FROM employees_info', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query error' });

        }
        res.json(results)
    })
    
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}) 


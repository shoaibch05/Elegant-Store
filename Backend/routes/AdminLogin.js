
const express = require('express');
const router = express.Router(); 
const db = require('../db');

// Authenticate user
router.post('/', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM admin WHERE Email = ? AND Password = ?';
    
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        } else if (results.length > 0) {
            req.session.adminId = results[0].id; 
            req.session.adminName = results[0].Name;
            return res.status(200).json({ message: 'Login successful', admiId: results[0].id }); // Send userId in response
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});


module.exports = router;

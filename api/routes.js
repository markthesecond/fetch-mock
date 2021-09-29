const express = require('express');
const points = require('../controllers/points');

// class for designing modular routes
const router = express.Router();

// route handlers for the path '/points'
router.route('/points')
    // makes GET req's return the point balance
    .get((req,res) => {
        res.json({message: 'Hello!'});
    })
    // accepts POST requests and records point transactions
    .post((req,res) => {
        // calls createPoints from the points controller
        points.createPoints(req.body.payer, req.body.points);
        res.status(201).json(
            {message: 'Points recorded!'}
        );
    })

module.exports = router;

const express = require('express');

const router = express.Router();

router.route('/points')
    .get((req,res) => {
        res.json({message: 'Hello!'});
    })

module.exports = router;

const express = require('express')
const cors = require('cors')
const router = express.Router()

/* GET home page. */
router.get('/', cors(), function (req, res, next) {
    res.send('index');
});

module.exports = router;

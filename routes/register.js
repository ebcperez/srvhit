const express = require('express')
const router = express.Router()

//get register view
router.get('/', (req, res) => {
    res.render('register')
})

module.exports = router
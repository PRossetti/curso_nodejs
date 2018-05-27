const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('app/home', { username: 'pepon', sessionId: req.session.id });
});

module.exports = router;
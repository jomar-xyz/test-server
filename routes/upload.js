var express = require('express');
var router = express.Router();

router.post('/', async function(req, res, next) {
    // var file = new File([req.body], "name");
    console.log(req.body)
    res.json(req.body)
});

module.exports = router;
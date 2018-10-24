var express = require('express');
const {mongoose} = require('../db/mongoose');
const {ToDo} = require('../models/todo');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send({message: 'Hello World'});
});
router.post('/', function (req, res, next) {
    let todo = new ToDo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(400).send({
            error: "Failed to save todo"
        });

    });
});
module.exports = router;
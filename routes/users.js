const express = require('express');
const _ = require('lodash');
const router = express.Router();
const {ObjectId} = require('mongodb');

const {mongoose} = require('../db/mongoose');
const {authenticate} = require('../middlewares/authenticate');
const {User} = require('../models/user');
router.post('/', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);
    user.save().then((u) => {
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

router.get('/me',authenticate,(req,res)=>{
        res.send(req.user);


});

module.exports = router;
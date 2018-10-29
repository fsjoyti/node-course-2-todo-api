const express = require('express');
const {User} = require('../models/user');
const _ = require('lodash');
const {mongoose} = require('../db/mongoose');
const router = express.Router();
const {ObjectId} = require('mongodb');

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

module.exports = router;
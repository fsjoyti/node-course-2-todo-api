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
router.post('/login',(req,res)=>{
    let body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken();
    }).then((token,user)=>{
        res.header('x-auth',token).send(user);
    }).catch((err)=>{
        res.status(400).send();
    });
});

router.delete('/me/token',authenticate,(req,res)=>{

    req.user.removeToken(req.token).then(()=>{
            res.status(200).send();
    }).catch((err)=>{
        res.status(400).send();
    });

});

module.exports = router;
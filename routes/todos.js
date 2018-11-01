const express = require('express');
const _ = require('lodash');
const {authenticate} = require('../middlewares/authenticate');
const {mongoose} = require('../db/mongoose');
const {ToDo} = require('../models/todo');
const router = express.Router();
const {ObjectId} = require('mongodb');


/* GET home page. */
router.get('/todos',authenticate, function (req, res, next) {
    ToDo.find({_creator: req.user._id}).then((todos)=>{
      res.send({todos});
    }).catch((err)=>{
        res.status(400).send(err);

    });

});
router.post('/todos',authenticate, function (req, res, next) {
    let todo = new ToDo({
        text: req.body.text,
        _creator:req.user._id
    });
    todo.save().then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);

    });
});

router.get('/todos/:id',authenticate, (req,res,next)=>{
    let id = req.params.id;
    ToDo.findOne({_id:id,_creator:req.user._id}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});

    }).catch((err)=>{
        res.status(400).send();
    });

});

router.delete('/todos/:id',authenticate,(req,res,next)=>{
    let id = req.params.id;
    ToDo.findOneAndDelete({_id:id,_creator:req.user._id}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err)=>{
        if(!ObjectId.isValid(id)){
            return res.status(404).send();
        }
        console.log(err);
        res.status(400).send();
    });

});

router.put('/todos/:id',authenticate,(req,res,next)=>{
    let id = req.params.id;
    let body = _.pick(req.body,['text','completed']);
    if(!ObjectId.isValid(id)){
        console.log('');
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
    ToDo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err)=>{
        res.status(400).send();
    });

});

;




module.exports = router;
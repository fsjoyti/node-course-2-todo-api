const express = require('express');
const _ = require('lodash');
const {mongoose} = require('../db/mongoose');
const {ToDo} = require('../models/todo');




const router = express.Router();
const {ObjectId} = require('mongodb');


/* GET home page. */
router.get('/todos', function (req, res, next) {
    console.log('modified');
    //res.render('index', { title: 'Express' });
    ToDo.find().then((todos)=>{
      res.send({todos});
    }).catch((err)=>{
        res.status(400).send(err);

    });

});
router.post('/todos', function (req, res, next) {
    let todo = new ToDo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);

    });
});

router.get('/todos/:id', (req,res,next)=>{
    let id = req.params.id;
    ToDo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});

    }).catch((err)=>{
        res.status(400).send();
    });

});

router.delete('/todos/:id',(req,res,next)=>{
    let id = req.params.id;
    ToDo.findOneAndDelete({_id:id}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err)=>{
        if(!ObjectId.isValid(id)){
            return res.status(404).send();
        }
        res.status(400).send();
    });

});

router.put('/todos/:id',(req,res,next)=>{
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
    ToDo.findOneAndUpdate({_id:id},{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err)=>{
        res.status(400).send();
    });

});

router.get('/users',(req,res,next)=>{
    res.send({message:"In progress"});
});




module.exports = router;
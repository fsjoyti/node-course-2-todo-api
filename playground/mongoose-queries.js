const {ToDo} = require('../models/todo');
const {User} = require('../models/user');
const {mongoose} = require('../db/mongoose');
const {ObjectId} = require('mongodb');
// let _id = '5bd0d50abc09e43e98667173jkjjk';
let id = '5bcf8d8e30bc2921dc94e5e5csc';
// if(!ObjectId.isValid(_id)){
//     console.log('Invalid id');
// }
// ToDo.find({_id}).then((todo)=>{
//     console.log(todo);
//
// }).catch((err)=>{
//     console.log(err);
// });

// ToDo.findOne({_id}).then((todo)=>{
//     console.log(todo);
//
// }).catch((err)=>{
//     console.log(err);
// });

// ToDo.findById(_id).then((todo)=>{
//     console.log(todo);
// }).catch((err)=>{
//     console.log(err);
// })
User.findById(id).then((user)=>{
    if (!user){
       return console.log('User does not exist');

    }


    console.log(user);
}).catch((err)=>
    {
        if(!ObjectId.isValid(id)){
            return console.log('Invalid id');

        }
    }
);

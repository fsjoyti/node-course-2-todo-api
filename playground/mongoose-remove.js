const {ToDo} = require('../models/todo');
const {User} = require('../models/user');
const {mongoose} = require('../db/mongoose');
const {ObjectId} = require('mongodb');

// ToDo.deleteMany({}).then((result)=>{
//     console.log(result);
// }).catch((err)=>{
//     console.log(err);
// });
let _id = '5bd1f4ae78da3a38ac74d646';
// ToDo.findOneAndRemove({_id}).then((res)=>{
//     console.log(`${res}`);
// }).catch((err)=>{
//     console.log('Here'+err);
// });

ToDo.findByIdAndRemove(_id).then((res)=>{
    console.log(res);
});


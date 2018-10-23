const {MongoClient,ObjectId} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('Unable to connect to MongoDB driver');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');
    // db.collection('Todos').findOneAndUpdate({_id:new ObjectId('5bce3f8ee7b63f1228bb3f76')}, {
    //     $set:{
    //         completed: true
    //     }
    // },{
    //     returnOriginal:false
    // }).then((result)=>{
    //     console.log(result);
    // }).catch((err)=>{
    //     console.log(err);
    // });

    db.collection('Users').findOneAndUpdate({_id:new ObjectId('5bcf2e809c215b19084fe961')}, {
        $set:{
            name: "Fahmida Joyti"
        },
        $inc:{
            age:3
        }
    },{
        returnOriginal:false
    }).then((result)=>{
        console.log(result);
    }).catch((err)=>{
        console.log(err);
    });

});
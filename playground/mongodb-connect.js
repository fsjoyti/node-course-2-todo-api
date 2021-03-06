const {MongoClient,ObjectId} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoAppTest',(err,client)=>
{
    if(err){
        return console.log('Unable to connect to MongoDB driver');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoAppTest');
    db.collection('todos').insertOne({
        text:'Something to do',
        completed:false
    },(err,result)=>{
        if(err){
            console.log('failed to insert in database',err);
        }

        console.log(JSON.stringify(result.ops,undefined,2));


    });
    db.collection('users').insertOne({
        name:'Ria',
        age:24,
        location:'Vancouver,Washington'
    },(err,result)=>{
        if(err){
            console.log('failed to insert user in database',err);
        }
        console.log(JSON.stringify(result.ops,undefined,2));

    });
    client.close();
});
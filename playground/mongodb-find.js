const {MongoClient,ObjectId} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('Unable to connect to MongoDB driver');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');
    // db.collection('Todos').find(
    //     {_id: new ObjectId('5bcf2f0655427a3d931254f4')}).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // },(err)=>{
    //     console.log('Unable to fetch ',err);
    // });

    // db.collection('Todos').find(
    //    ).count().then((count)=>{
    //     console.log(`Todos Count ${count}`);
    //
    // }).catch((err)=>{
    //     console.log(err);
    // });

    db.collection('Users').find({name:"Ria",location:"Ames,Iowa"}).toArray().then((docs)=>{
        console.log(JSON.stringify(docs,undefined,2));
    }).catch((err)=>{
        console.log(err);
    });
});
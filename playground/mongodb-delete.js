const {MongoClient,ObjectId} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('Unable to connect to MongoDB driver');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

   // delete many
    db.collection('Todos').deleteMany({text:"Eat Lunch"}).then((result)=>{
            console.log(result);
        }).catch((err)=>{
            console.log(err);
        });

    db.collection('Todos').deleteOne({text:"Go to office"}).then((result)=>{
        console.log(result);
    }).catch((err)=>{
        console.log(err);
    });

    db.collection('Todos').findOneAndDelete({completed:true}).then((result)=>{
       console.log(result) ;
    }).catch((err)=>{
        console.log(err);
    });
    db.collection('Users').deleteMany({name:"Ria"}).then((result)=>{
      console.log(result)  ;
    }).catch((err)=>{
        console.log(err);
    });
    db.collection('Users').findOneAndDelete({_id: new ObjectId("5bcf457b55427a3d93125bae")}).then((result)=>{
        console.log(JSON.stringify(result,undefined,2));
    }).catch((err)=>{
        console.log(err);
    })
});
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp').then((result)=>{
    console.log('Connected successfully');
}).catch((err)=>{
    console.log(`Error in establishing connection to mongodb database ${err}`)
});

module.exports = {
    mongoose
}
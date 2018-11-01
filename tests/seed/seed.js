const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
const {ToDo} = require('../../models/todo');
const {User} = require('../../models/user');
const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const users = [{
    _id:userOneId,
    email:"fsjoyti@iastate.edu",
    password:"userOnePass$%",
    tokens:[{
        access:"auth",
        token:jwt.sign({_id:userOneId.valueOf(),access:"auth"},'%&paNeraert*cvBfe4RJFnxsdwef@').toString()
    }]
},{
    _id:userTwoId,
    email:'souparni@iastate.edu',
    password:"userTwoPass$%",
    tokens:[{
        access:"auth",
        token:jwt.sign({_id:userTwoId.valueOf(),access:"auth"},'%&paNeraert*cvBfe4RJFnxsdwef@').toString()
    }]

}]
const todos = [{
    _id: new ObjectId(),
    text: 'First test todo',
    _creator:userOneId
}, {
    _id: new ObjectId(),
    text: 'Second test todo',
    completed:true,
    completedAt:333,
    _creator:userTwoId
}];

const populateTodos = (done)=>{
    ToDo.deleteMany({}).then(() => {
            return ToDo.insertMany(todos)
        }
    ).then(() => done());
};

const populateUsers = (done)=>{
    User.deleteMany({}).then(()=>{
       let userOne = new User(users[0]).save();
       let userTwo = new User(users[1]).save();
       return Promise.all([userOne,userTwo]);

    }).then(()=> done());
};
module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};


const chai = require('chai'), expect = chai.expect
    , should = chai.should();

const chaiHttp = require('chai-http')
const {ObjectId} = require('mongodb');
chai.use(chaiHttp);
const {app} = require('../app');
const {ToDo} = require('../models/todo');
const {User} = require('../models/user');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');
beforeEach(populateUsers);
beforeEach(populateTodos);
describe('#Todo apis', () => {
    console.log('here');
    describe('POST /todos', () => {
        it('should save the todo ', (done) => {
            let text = 'Test todo text';
            chai.request(app).post('/todos').send({text}).end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('text');
                if (err) {
                    return done(err);
                }
                ToDo.find({text}).then((todos) => {
                    expect(todos.length).to.equal(1);
                    expect(res.body).to.deep.include({text: text});
                    done();
                }).catch((err) => {
                    done(err);
                });

            });

        });

        it('should not save the todo', (done) => {
            chai.request(app).post('/todos').send({}).end((err, res) => {
                expect(res.statusCode).to.equal(400);
                if (err) {
                    return done(err);
                }
                ToDo.find().then((todos) => {
                    expect(todos.length).to.equal(2);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
        });
    });

    describe('GET /todos', () => {
        it('should get all todos', (done) => {
            chai.request(app).get('/todos').end((err, res) => {
                ToDo.find().then((todos) => {
                    expect(todos.length).to.equal(2);
                    done();
                }).catch((err) => {
                    done(err);
                });


            });

        });

    });

    describe('GET /todos/:id', () => {
        it('should get a todo', (done) => {
            chai.request(app).get(`/todos/${todos[0]._id.valueOf()}`).end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('todo');
                expect(res.body.todo).to.have.property('text');
                expect(res.body.todo.text).to.eql(`${todos[0].text}`);
                done();
            });
        });

        it('should give a 404 if todo not found',(done)=>{
            let newId = new ObjectId().valueOf();
            chai.request(app).get(`/todos/${newId}`).end((err,res)=>{
                expect(res.statusCode).to.equal(404);
                done();
            });
        });

        it('should give a 400 if todo is invalid',(done)=>{
            chai.request(app).get(`/todos/ffregfr`).end((err,res)=>{
                expect(res.statusCode).to.equal(400);
                done();
            });
        });

    });

    describe('DELETE /todos/:id',()=>{
        let id = todos[1]._id.valueOf();
        it('should delete a todo',(done)=>{
            chai.request(app).delete(`/todos/${id}`).end((err,res)=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('todo');
                expect(res.body.todo).to.have.property('text');
                //expect(res.body.todo._id).to.eql(id);
                expect(res.body.todo.text).to.eql(`${todos[1].text}`);
                done();
            });

            it('should give a 404 if todo not found',(done)=>{
                let newId = new ObjectId().valueOf();
                chai.request(app).delete(`/todos/${newId}`).end((err,res)=>{
                    expect(res.statusCode).to.equal(404);
                    done();
                });
            });
            it('should give a 404 if todo is invalid',(done)=>{
                chai.request(app).delete(`/todos/ffregfr`).end((err,res)=>{
                    expect(res.statusCode).to.equal(400);
                    done();
                });
            });


        });



    });

    describe('PUT /todos/:id',()=>{
        it('should update the todo',(done)=>{
            let id = todos[0]._id.valueOf();
            let text = 'modified text';
            chai.request(app).put(`/todos/${id}`).send({text,completed: true}).end((err,res)=>{
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('todo');
                expect(res.body.todo).to.have.property('completed',true);
                expect(res.body.todo).to.have.property('text');
                expect(res.body.todo.text).to.eql(`${text}`);
                expect(res.body.todo).to.have.property('completedAt');
                expect(res.body.todo.completedAt).to.be.a('number');
                done();

            });

        });

        it('should clear completedAt when todo is not completed',(done)=>{
            let id = todos[1]._id.valueOf();
            chai.request(app).put(`/todos/${id}`).send({completed:false}).end((err,res)=>{
                expect(res.status).to.equal(200);
                expect(res.body.todo).to.have.property('completed',false);
                expect(res.body.todo).to.have.property('completedAt');
                expect(res.body.todo.completedAt).to.be.a('null');
                done();
            })

        })

    });
    describe('GET /users/me',()=>{
        it('should return user if authenticated',(done)=>{
            chai.request(app).get('/users/me').set('x-auth',users[0].tokens[0].token).end((err,res)=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('email',users[0].email);
                done();
            });

        });
        it('should return 401 if not authenticated',(done)=>{
           chai.request(app).get('/users/me').end((err,res)=>{
               expect(res.statusCode).to.equal(401);
               expect(res.body).to.eql({});
               done();
           });
        });
    });

    describe('POST /users',()=>{
        it('should create a user',(done)=>{
            let email = 'example@example.com';
            let password = '134$%^^vrgrd#';
            chai.request(app).post('/users').send({email,password}).end((err,res)=>{
                expect(res).to.have.header('x-auth');
                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('email',email);
                User.findOne({email}).then((user)=>{
                    expect(user).to.exist;
                    expect(user).to.have.property('password').and.not.equal(password);
                    done();
                });

            });

        });

        it('should return validation errors if request invalid',(done)=>{
            let email = 'invalid';
            let password = '';
            chai.request(app).post('/users').send({email,password}).end((err,res)=>{
                expect(res.statusCode).to.equal(400);
                done();
            });

        });

        it('should not create user email in use',(done)=>{
            let email = users[0].email;
            let password = 'whatever';
            chai.request(app).post('/users').send({email,password}).end((err,res)=>{
                expect(res.statusCode).to.equal(400);
                done();
            });


        });

    });

    describe('POST /users/login',()=>{
        let email = users[1].email;
        let password = users[1].password;
        it('should login user and return valid auth token',(done)=>{
            chai.request(app).post('/users/login').send({email,password}).end((err,res)=>{
                if(err){
                    done(err);
                }
                expect(res.status).to.equal(200);
                expect(res).to.have.header('x-auth');
                User.findOne({_id:users[1]._id}).then((user)=>{
                    expect(user).to.exist;
                    expect(user).to.have.property('tokens');
                    expect(user.tokens[0]).to.include({access:'auth',token:res.headers['x-auth']});
                    done();
                }).catch((err)=>done(err));

            });
        });

        it('should reject invalid login',(done)=>{

            chai.request(app).post('/users/login').send({email,password:'wrong password'}).end((err,res)=>{
                if(err){
                    done(err);
                }
                expect(res.status).to.equal(400);
                expect(res).to.have.not.header('x-auth');
                User.findOne({_id:users[1]._id}).then((user)=>{
                    expect(user).to.exist;
                    expect(user).to.have.property('tokens');
                    expect(user.tokens.length).to.equal(0);
                    done();
                }).catch((err)=>done(err));

            });
        });

        });


});
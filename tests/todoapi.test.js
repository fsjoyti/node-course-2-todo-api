const request = require('supertest');
const chai = require('chai'), expect = chai.expect
    , should = chai.should();
const sinon = require('sinon');
const {ObjectId} = require('mongodb');

const {app} = require('../app');
const {ToDo} = require('../models/todo');
const {User} = require('../models/user');
const todos = [{
    _id: new ObjectId(),
    text: 'First test todo'
}, {
    _id: new ObjectId(),
    text: 'Second test todo',
    completed:true,
    completedAt:333
}];
beforeEach((done) => {
    ToDo.deleteMany({}).then(() => {
            return ToDo.insertMany(todos)
        }
    ).then(() => done());
});
describe('#Todo apis', () => {
    describe('POST /todos', () => {
        it('should save the todo ', (done) => {
            let text = 'Test todo text';
            request(app).post('/todos').send({text}).end((err, res) => {
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
            request(app).post('/todos').send({}).end((err, res) => {
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
            request(app).get('/todos').end((err, res) => {
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
            request(app).get(`/todos/${todos[0]._id.valueOf()}`).end((err, res) => {
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
            request(app).get(`/todos/${newId}`).end((err,res)=>{
                expect(res.statusCode).to.equal(404);
                done();
            });
        });

        it('should give a 400 if todo is invalid',(done)=>{
            request(app).get(`/todos/ffregfr`).end((err,res)=>{
                expect(res.statusCode).to.equal(400);
                done();
            });
        });

    });

    describe('DELETE /todos/:id',()=>{
        let id = todos[1]._id.valueOf();
        it('should delete a todo',(done)=>{
            request(app).delete(`/todos/${id}`).end((err,res)=>{
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
                request(app).delete(`/todos/${newId}`).end((err,res)=>{
                    expect(res.statusCode).to.equal(404);
                    done();
                });
            });
            it('should give a 404 if todo is invalid',(done)=>{
                request(app).delete(`/todos/ffregfr`).end((err,res)=>{
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
            request(app).put(`/todos/${id}`).send({text,completed: true}).end((err,res)=>{
                expect(res.statusCode).to.equal(200);
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
            request(app).put(`/todos/${id}`).send({completed:false}).end((err,res)=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body.todo).to.have.property('completed',false);
                expect(res.body.todo).to.have.property('completedAt');
                expect(res.body.todo.completedAt).to.be.a('null');
                done();
            })

        })

    });

});
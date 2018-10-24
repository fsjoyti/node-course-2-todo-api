const request = require('supertest');
const chai = require('chai'), expect = chai.expect
    , should = chai.should();
const sinon = require('sinon')
const {app} = require('../app');
const {ToDo} = require('../models/todo');

beforeEach((done)=>{
    ToDo.deleteMany({}).then(()=> done());
});
describe('#Todo apis',()=>{
    describe('POST /todos',()=>{
        it('should save the todo ',(done)=>{
            let text = 'Test todo text';
            request(app).post('/todos').send({text}).end((err,res)=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('text');
                if(err) {
                   return done(err);
                }
                ToDo.find().then((todos)=>{
                    expect(todos.length).to.equal(1);
                    expect(res.body).to.deep.include({text:text});
                    done();
                }).catch((err)=>{
                    done(err);
                });

            });

        });

        it('should not save the todo',(done)=>{
            request(app).post('/todos').send({}).end((err,res)=>{
                expect(res.statusCode).to.equal(400);
                expect(res.body).to.have.property('error','Failed to save todo');
                if(err) {
                    return done(err);
                }
                ToDo.find().then((todos)=>{
                    expect(todos.length).to.equal(0);
                    done();
                }).catch((err)=>{
                    done(err);
                });
            });
        });
    });

});
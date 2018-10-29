const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
let UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlength: 1,
        trim: true,
        unique:true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]

});

UserSchema.methods.generateAuthToken = function(){
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id:user._id.valueOf(),access},'%&paNeraert*cvBfe4RJFnxsdwef@').toString();
    user.tokens = user.tokens.concat([{access,token}]);
    return user.save().then(()=>{
        return token;
    });


};

UserSchema.statics.findByToken = function(token){
    let user = this;
    let decoded;
    try{
        decoded = jwt.verify(token,'%&paNeraert*cvBfe4RJFnxsdwef@');
    }catch(err){
            return Promise.reject();
    }
    return user.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}
UserSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    return _.pick(userObject,['_id','email']);
};

let User = mongoose.model('User',UserSchema);
module.exports = {
    User
};
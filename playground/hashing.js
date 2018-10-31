const {SHA256}= require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc!';

bcrypt.genSalt(10).then((salt)=> {
        return bcrypt.hash(password, salt);
    }
).then((hash)=>{
    console.log(hash);

}).catch((err)=>{
    console.log(err);
});
let hashedPassword = '$2a$10$3NSgFJ8ckTdPiaIv8kEI1eCjdiwlBUFU8ClB9VZhRv8DRMHJLJMS2';
bcrypt.compare(password,hashedPassword,(err,res)=>{
    console.log(res);
});
// let data = {
//     id:10
// };
// let token =jwt.sign(data,'%&paNeraert*cvBfe4RJFnxsdwef@');
// let decoded = jwt.verify(token,'%&paNeraert*cvBfe4RJFnxsdwef@');
// console.log(decoded);
// let message = 'I am user number 3';
// let hash = SHA256(message).toString();
// console.log(`Message:${message}`);
// console.log(`Hash:${hash}`);
//
// let data = {
//     id:4
// };
//
// let token = {
//     data,
//     hash:SHA256(JSON.stringify(data)+'1secretKey355#').toString()
// };
//
// let resultHash = SHA256(JSON.stringify(token.data)+'1secretKey355#').toString();
//
// if(resultHash === token.hash){
//     console.log('Data was not changed');
// }else{
//     console.log('Data changed');
// }
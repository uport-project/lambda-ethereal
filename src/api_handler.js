'use strict'
const AWS = require('aws-sdk');

const RequestHandler = require('./handlers/request');
const CallbackHandler = require('./handlers/callback');

const AttestationMgr = require('./lib/attestationMgr');

let attestationMgr = new AttestationMgr();


let requestHandler = new RequestHandler(attestationMgr);
module.exports.request = (event, context, callback) => { preHandler(requestHandler,event,context,callback) }

let callbackHandler = new CallbackHandler(attestationMgr);
module.exports.callback = (event, context, callback) => { preHandler(callbackHandler,event,context,callback) }

const preHandler = (handler,event,context,callback) =>{
  console.log(event)
  if(!attestationMgr.isSecretsSet() ){
    const kms = new AWS.KMS();
    kms.decrypt({
      CiphertextBlob: Buffer(process.env.SECRETS, 'base64')
    }).promise().then(data => {
      const decrypted = String(data.Plaintext)
      attestationMgr.setSecrets(JSON.parse(decrypted))
      doHandler(handler,event,context,callback)
    })
  }else{
    doHandler(handler,event,context,callback)
  }
}

const doHandler = (handler,event,context,callback) =>{
  handler.handle(event,context,(err,resp)=>{
    let response;
    if(err==null){
      response = {
          statusCode: 200,
          body: JSON.stringify({
            status: 'success',
            data: resp
          })
        }
    }else{
      //console.log(err);
      let code=500;
      if(err.code) code=err.code;
      let message=err;
      if(err.message) message=err.message;
      
      response = {
        statusCode: code,
        body: JSON.stringify({
          status: 'error',
          message: message
        })
      }
    }

    callback(null, response)
  })

} 

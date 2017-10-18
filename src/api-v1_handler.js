'use strict'

const QrDataHandler = require('./api-v1/qrdata');
const CallbackHandler = require('./api-v1/callback');

const AttestationMgr = require('./lib/attestationMgr');

let attestationMgr = new AttestationMgr(process.env.SIGNER_KEY,process.env.APP_NAME,process.env.APP_MNID);

let qrDataHandler = new QrDataHandler(attestationMgr);
let callbackHandler = new CallbackHandler(attestationMgr);

module.exports.qrdata = (event, context, callback) => {
  console.log(event)
  //console.log(event.body)
  let body;
  try{ body = JSON.parse(event.body) } catch(e){console.log(e);body={}}
  qrDataHandler.handle(body,(err,resp)=>{
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
    console.log("Response:"+JSON.stringify(response))
    callback(null, response)
  })

  

}

module.exports.callback = (event, context, callback) => {
  console.log(event)
  //console.log(event.body)
  let body;
  try{ body = JSON.parse(event.body) } catch(e){console.log(e);body={}}
  CallbackHandler.handle(body,(err,resp)=>{
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
    console.log("Response:"+JSON.stringify(response))
    callback(null, response)
  })

  

}


class RequestHandler {
    constructor (attestationMgr) {
      this.attestationMgr = attestationMgr
    }
  
    async handle(event,context, cb) {
      let body;
  
      if (event && !event.body){
        body = event
      } else if (event && event.body) {
        try {
          body = JSON.parse(event.body)
        } catch (e) {
          cb({ code: 400, message: 'no json body'})
          return;
        }
      } else {
        cb({code: 400, message: 'no json body'})
        return;
      }
  
      if (!body.eventName) {
        cb ({code: 400, message: 'eventName parameter missing'})
        return;
      }

      try{
        console.log("calling attestationMgr.request")
        let requestToken= await this.attestationMgr.request(body.eventName);
        let request='me.uport:me?requestToken='+requestToken
        cb(null,request)
      } catch(err) {
        console.log("Error on this.attestationMgr.requestToken")
        console.log(err)
        cb({ code: 500, message: err })
        return;
      }

    }
  
  }
  
  module.exports = RequestHandler
  
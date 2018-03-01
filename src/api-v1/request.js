
class RequestHandler {
    constructor (attestationMgr) {
      this.attestationMgr = attestationMgr
    }
  
    async handle(event,context, cb) {
      let requestToken= await this.attestationMgr.requestToken();
      let request='me.uport:me?requestToken='+requestToken
      cb(null,request)
    }
  
  }
  
  module.exports = RequestHandler
  
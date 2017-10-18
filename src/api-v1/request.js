
class RequestHandler {
    constructor (attestationMgr) {
      this.attestationMgr = attestationMgr
    }
  
    async handle(body, cb) {
      let requestToken= await this.attestationMgr.requestToken();
      let request='me.uport:me?requestToken='+requestToken
      cb(null,request)
    }
  
  }
  
  module.exports = RequestHandler
  
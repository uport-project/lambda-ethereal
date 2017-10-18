
class CallbackHandler {
    constructor (attestationMgr) {
      this.attestationMgr = attestationMgr
    }
  
    async handle(body, cb) {
      // Check empty body
      if (!body) {
        cb({code: 403, message: 'no body'})
        return
      }
      
      cb({code:500, message:'function CallbackHandler.handle() not implemented'})
    }
  
  }
  
  module.exports = CallbackHandler
  
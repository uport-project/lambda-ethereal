
class QrDataHandler {
    constructor (attestationMgr) {
      this.attestationMgr = attestationMgr
    }
  
    async handle(body, cb) {
      
      cb({code:500, message:'function QrDataHandler.handle() not implemented'})
    }
  
  }
  
  module.exports = QrDataHandler
  
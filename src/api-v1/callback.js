
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

      // Check empty access_token
      if (!body.access_token) {
        cb({code: 403, message: 'no access_token'})
        return
      }

      let notification_token=body.access_token;

      //Issue attestation (sub: mnid of pnt issuer)
      console.log("getting iss from notification_token")
      let iss=await this.attestationMgr.issFromJWT(notification_token)
      console.log("Creating attestation for iss:" +iss)
      let attestation = await this.attestationMgr.attest(iss);
      console.log("Attestation:"+attestation);

      //Push attetation to pututu
      console.log("Pushing to pututu")
      await this.attestationMgr.push(notification_token,attestation);
      console.log("DONE")

      
      cb(null,attestation)
    }
  
  }
  
  module.exports = CallbackHandler
  
class CallbackHandler {
    constructor (attestationMgr) {
      this.attestationMgr = attestationMgr
    }

    async handle(event,context, cb) {

      let eventName;
      if (event.pathParameters && event.pathParameters.eventName){
        eventName = event.pathParameters.eventName;
      }else{
        cb({code: 400, message: 'no pathParameter eventName'})
        return;
      }

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
  
      if (!body.access_token) {
        cb ({code: 400, message: 'access_token parameter missing'})
        return;
      }

      console.log("access_token:"+body.access_token);

      //Receive access token.
      let profile;
      try{
        console.log("calling attestationMgr.receiveAccessToken")
        let profile=await this.attestationMgr.receiveAccessToken(eventName,body.access_token);
        console.log("<profile>");
        console.log(profile);
        console.log("</profile>")
      } catch(err) {
        console.log("Error on this.attestationMgr.receiveAccessToken")
        console.log(err)
        cb({ code: 500, message: err.message })
        return;
      }

      let sub=profile.address

      //Issue attestation
      console.log("Creating attestation for sub:" +sub)
      let attestation;
      try{
        console.log("calling attestationMgr.attest")
        let attestation = await this.attestationMgr.attest(eventName,sub);
      } catch(err) {
        console.log("Error on this.attestationMgr.attest")
        console.log(err)
        cb({ code: 500, message: err.message })
        return;
      }
      console.log("Attestation:"+attestation);

      //Push attetation to pututu
      console.log("Pushing to pututu")
      try{
        console.log("calling attestationMgr.push")
        await this.attestationMgr.push(eventName,profile.pushToken, profile.publicEncKey, attestation);
      } catch(err) {
        console.log("Error on this.attestationMgr.push")
        console.log(err)
        cb({ code: 500, message: err })
        return;
      }
      console.log("Pushed")

      console.log("Full DONE.");
      cb(null,attestation)
    }

  }

  module.exports = CallbackHandler

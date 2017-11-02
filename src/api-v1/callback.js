import { Analytics } from 'analytics-node'

class CallbackHandler {
    constructor (attestationMgr,analytics) {
      this.attestationMgr = attestationMgr
      this.analytics = analytics
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
      console.log("access_token:"+body.access_token);

      let profile=await this.attestationMgr.receiveAccessToken(body.access_token);
      console.log("<profile>");
      console.log(profile);
      console.log("</profile>");

      let sub=profile.address
      //Issue attestation
      console.log("Creating attestation for sub:" +sub)
      let attestation = await this.attestationMgr.attest(sub);
      console.log("Attestation:"+attestation);

      //Push attetation to pututu
      console.log("Pushing to pututu")
      await this.attestationMgr.push(profile.pushToken, profile.publicEncKey, attestation);
      console.log("Pushed")

      //Segment.io Analytics
      console.log("Tracking event to segment.io")
      this.analytics.group({
        userId: sub,
        groupId: 'devcon3',
        traits: {
          event: "Devcon3",
          date: "November 1-4, 2017",
          location: "Cancún, México"
        }
      });
      this.analytics.track({
        userId: sub,
        event: 'Devcon3 Attendance Recorded'
      })
      console.log("Done")

      console.log("Full DONE.");
      cb(null,attestation)
    }

  }

  module.exports = CallbackHandler

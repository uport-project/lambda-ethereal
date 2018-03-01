import { decodeToken } from 'jsontokens'
import { Credentials, SimpleSigner } from 'uport'

class AttestationMgr {

    constructor() {
        this.credentials=null;
        this.callbackUrl=null;
    }

    isSecretsSet(){
        return (this.credentials !== null || this.callbackUrl !== null);
    }

    setSecrets(secrets){
        this.credentials = new Credentials({
          appName: secrets.APP_NAME,
          address: secrets.APP_MNID,
          signer:  SimpleSigner(secrets.SIGNER_KEY)
        })
        this.callbackUrl = secrets.CALLBACK_URL
    }


    //Create Request
    requestToken(){
        let requestOpts={
            notifications: true,
            callbackUrl: this.callbackUrl,
            exp: 1519763400 //till Tuesday, 27 de February de 2018 20:30:00 GMT
        }
        return this.credentials.createRequest(requestOpts);
    }

    //Extract iss from PNT
    receiveAccessToken(at){
        return this.credentials.receive(at);
    }

    //Create attestation for the sub
    attest(sub){
        let att={
            sub: sub,
            claim: {
                "Attended | uPort Community Call": {
                    event: "uPort Community Call",
                    date: "February 27, 2018",
                    location: "uPort Town Hall"
                }
            }
        }
        return this.credentials.attest(att);
    }

    //Push notification to the user
    push(pushToken, pubEncKey, attestation){
        let url='me.uport:add?attestations='+attestation
        return this.credentials.push(pushToken, pubEncKey, {url})
    }
}

module.exports = AttestationMgr;

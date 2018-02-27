import { decodeToken } from 'jsontokens'
import { Credentials, SimpleSigner } from 'uport'

class AttestationMgr {

    constructor(privateKey,appName,appMnid,callbackUrl) {
        this.privateKey=privateKey;
        this.appMnid=appMnid;

        const signer = SimpleSigner(this.privateKey)
        this.credentials = new Credentials({
          appName: appName,
          address: this.appMnid,
          signer: signer
        })

        this.callbackUrl=callbackUrl;
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

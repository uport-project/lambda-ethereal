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
            //(no expiration) exp: 1509850800 //till Sunday, 5 de November de 2017 3:00:00 
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
                "I Attended DEVCON3": {
                    event: "DEVCON3",
                    date: "November 1-4, 2017",
                    location: "Cancún, México"
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

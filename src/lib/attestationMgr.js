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
            exp: 1512529200 //till Wednesday, 6 de December de 2017 3:00:00
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
                "I Attended laBitConf": {
                    event: "laBitConf",
                    date: "December 4-5, 2017",
                    location: "Bogotá, Colombia"
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

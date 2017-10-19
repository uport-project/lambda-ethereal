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
            callbackUrl: this.callbackUrl
        }
        return this.credentials.createRequest(requestOpts);
    }

    //Create attestation for the sub
    attest(sub){
        let expires=( Math.floor( Date.now() / 1000 ) + 30*24*60*60); //In 30 days (epoch in seconds)
        let att={
            sub: sub,
            exp: expires,
            claim: {etherReal:'OK'}
        }   
        return this.credentials.attest(att);
    }

    //Push notification to the user
    push(pushToken,attestation){
        let url='me.uport:add?attestation='+attestation
        return this.credentials.push(pushToken,{url})
    }
}    

module.exports = AttestationMgr;
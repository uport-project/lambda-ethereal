import { decodeToken } from 'jsontokens'
import { Credentials, SimpleSigner } from 'uport'
import events from './events'


class AttestationMgr {

    constructor() {
        this.credentials={};
        this.callbackUrl=null;
    }

    isSecretsSet(){
        return ( this.callbackUrl !== null);
    }

    setSecrets(secrets){
        for (const eventName in events) {
            this.credentials[eventName] = new Credentials({
                appName: events[eventName].signer_name,
                address: events[eventName].signer_mnid,
                signer:  new SimpleSigner(secrets['SIGNER_KEY_'+eventName.toUpperCase()])
            })
        }
        this.callbackUrl = secrets.CALLBACK_URL
    }


    //Create Request
    requestToken(eventName){
        let requestOpts={
            notifications: true,
            callbackUrl: "https://requestb.in/16sac2g1", //this.callbackUrl+'/'+eventName,
            exp: events[eventName].expire
        }
        return this.credentials[eventName].createRequest(requestOpts);
    }

    //Extract iss from PNT
    receiveAccessToken(eventName,at){
        return this.credentials[eventName].receive(at);
    }

    //Create attestation for the sub
    attest(eventName,sub){
        let att={
            sub: sub,
            claim: events[eventName].claim
        }
        return this.credentials[eventName].attest(att);
    }

    //Push notification to the user
    push(eventName,pushToken, pubEncKey, attestation){
        let url='me.uport:add?attestations='+attestation
        return this.credentials[eventName].push(pushToken, pubEncKey, {url})
    }
}

module.exports = AttestationMgr;

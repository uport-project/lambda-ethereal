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
            console.log(secrets['SIGNER_KEY_'+eventName.toUpperCase()])
            console.log(events[eventName].signer_name)
            console.log(events[eventName].signer_mnid)
            this.credentials[eventName] = new Credentials({
                appName: events[eventName].signer_name,
                address: events[eventName].signer_mnid,
                signer:  new SimpleSigner(secrets['SIGNER_KEY_'+eventName.toUpperCase()])
            })
            console.log(this.credentials[eventName])

        }
        this.callbackUrl = secrets.CALLBACK_URL
    }


    //Create Request
    requestToken(eventName){
        let requestOpts={
            notifications: true,
            callbackUrl: this.callbackUrl+'/'+eventName,
            exp: events[eventName].expire
        }
        return this.credentials[eventName].createRequest(requestOpts);
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

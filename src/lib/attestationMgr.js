import events from './events'
import { Credentials } from 'uport-credentials'
import { transport } from 'uport-transports'

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
            const did=events[eventName].signer_did
            const didE = did.replace(/:/g,'_');
            this.credentials[eventName] = new Credentials({
                appName: events[eventName].signer_name,
                did: did,
                privateKey: secrets['SIGNER_KEY_'+didE]
            })
        }
        this.callbackUrl = secrets.CALLBACK_URL
    }

    //Create Request
    async request(eventName){
        let requestOpts={
            notifications: true,
            callbackUrl: this.callbackUrl+'/'+eventName,
            exp: events[eventName].expire
        }
        return await this.credentials[eventName].createDisclosureRequest(requestOpts);
    }

    //Extract iss from PNT
    async authenticate(eventName,token){
        return await this.credentials[eventName].authenticateDisclosureResponse(token);
    }

    //Create attestation for the sub
    async attest(eventName,sub){
        let att={
            sub: sub,
            claim: events[eventName].claim
        }
        return this.credentials[eventName].createVerification(att);
    }

    //Push notification to the user
    async push(eventName,pushToken, pubEncKey, attestation){
        const url='me.uport:add?attestations='+attestation
        const pushTransport = transport.push.send(pushToken, pubEncKey)
        return await pushTransport(url)
    }
}

module.exports = AttestationMgr;

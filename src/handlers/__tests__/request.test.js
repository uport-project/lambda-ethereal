const RequestHandler = require('../request');

describe('RequestHandler', () => {
    
    let sut;

    beforeAll(() => {
        //TODO: Provide a mocked version of the attestationMgr
        let attestationMgr=null
        sut = new RequestHandler(attestationMgr);
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    

});
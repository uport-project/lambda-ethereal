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

    test('handle null body', done => {
        sut.handle(null,(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(403)
            expect(err.message).toEqual('no body')
            done();
        })
    });

    test('handle empty body', done => {
        sut.handle({},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(403)
            expect(err.message).toEqual('no payload')
            done();
        })
    })

});
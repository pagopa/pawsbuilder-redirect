const handler = require('./rewriter');

const buildRequest = (host: string, path: string) => {
    return {
        request: {
            headers: {
                host: host
            },
            uri: path,
        } 
    }
}

const buildResponse = (path: string) => {
    return {
        statusCode: 301,
        statusDescription: "Moved Permanently",
        headers: {
            location: { value: path }
        }
    }
}

describe('ioapp.it redirects', () => {

    it('Should intercept ioapp.it redirects', () => {
        expect(handler(buildRequest("ioapp.it", "/it/blocco-accesso/magic-link/"))).toEqual(buildResponse( "https://account.ioapp.it/it/blocco-accesso/link-scaduto/"));
        expect(handler(buildRequest("ioapp.it", "/it/blocco-accesso/magic-link"))).toEqual(buildResponse( "https://account.ioapp.it/it/blocco-accesso/link-scaduto/"));

        expect(handler(buildRequest("ioapp.it", "/it/blocco-accesso/magic-link/something"))).toEqual( buildRequest("ioapp.it", "/it/blocco-accesso/magic-link/something").request )
    });

    it('Should not intercept these resources', () => {
        expect(handler(buildRequest("ioapp.it", "/not-mapped/"))).toEqual( buildRequest("ioapp.it", "/not-mapped/").request )
    })

});

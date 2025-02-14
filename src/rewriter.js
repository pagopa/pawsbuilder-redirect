/*****************************************************
 * Before modifying the code here below, please      *
 * follow the instructions here:                     *
 * https://github.com/pagopa/pawsbuilder-redirect    *
 *****************************************************/
var simpleHelper = function(base, usePath) {
    var stringRegex = base.replaceAll("/", "\\/").replaceAll(".", "\\.");
    if (usePath) {
        stringRegex += "(.*)";
    }
    var regex = new RegExp(stringRegex);
    regex._helper = "simpleHelper";
    return regex;
}

var regexPatterns = [
    {
        host: "ioapp.it", regex: simpleHelper("/it/blocco-accesso/magic-link", false), redirectTo: "https://account.ioapp.it/it/blocco-accesso/link-scaduto/"
    },

];

function handler(event) {
    if (!event || !event.request || typeof event.request.uri !== 'string') {
        return {
            statusCode: 400,
            statusDescription: "Bad Request",
            body: "Invalid URI"
        };
    }

    var request = event.request;
    var uri = request.uri;
    var host = request.headers.host.toLocaleLowerCase();

    for (var i = 0; i < regexPatterns.length; i++) {
        
        if (regexPatterns[i].host.toLocaleLowerCase() === host) {
            var pattern = regexPatterns[i];
            var match = pattern.regex.exec(uri);

            if (match) {
                var path = null;

                if (pattern.regex._helper == "simpleHelper") {
                    path = match[1];
                }

                var targetUri = pattern.redirectTo;

                if (path != null) {
                    targetUri += path;
                }

                return {
                    statusCode: 301,
                    statusDescription: "Moved Permanently",
                    headers: {
                        location: { value: targetUri }
                    }
                };
            }
        }
    }

    return event.request;
}
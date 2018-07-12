const requests = chrome.webRequest,
    navRequests = chrome.webNavigation,
    PROTOCOL_SEP = '://',
    GO_ICON = 'images/go32.png',
    STOP_ICON = 'images/stop32.png',
    URL_FILTER = {
        urls: ['https://*/*', 'http://*/*']
    },
    allowedURLList = [],
    blockedURLList = [],
    useFQDN = false;

let pageUrl,
    icon = GO_ICON;

function parseHostProtocol(inUrl) {
    if (!inUrl) {
        return {};
    }

    let host, protocol;

    // we have a URL but it has no protocol
    if (inUrl.indexOf(PROTOCOL_SEP) > -1) {
        host = inUrl.split(PROTOCOL_SEP);
        if (!host) {
            return {};
        }
    } else {
        host = inUrl;
    }

    if (Array.isArray(host)) {
        if (host.length > 1) {
            protocol = host[0];
            host = host[1];
        } else {
            host = host[0];
        }
    }

    // by here we have host
    const idx = host.indexOf('/');
    if (idx > -1) {
        // remove everything after the first remaining /
        // ie foo.com/ becomes foo.com
        host = host.substring(0, idx);
    }

    if (!useFQDN && host && host.length > 0) {
        const hostParts = host.split('.');
        if (hostParts.length > 0) {
            host = hostParts[hostParts.length - 2] + '.' + hostParts[hostParts.length - 1];
        }
    }

    // return fqdn (fully qualified domain name) 
    return {
        host,
        protocol
    };
}

function getFilter(url) {
    let pageUrl;
    if (url) {
        let {
            host, protocol
        } = parseHostProtocol(url);

        // we don't always have protocol 
        if (host) {
            pageUrl = host;
        }
    }
    return pageUrl;
}

chrome.tabs.onActivated.addListener((data) => {
    chrome.tabs.get(data.tabId, (tab) => {
        let url = getFilter(tab.url);
    });
});

chrome.tabs.onUpdated.addListener((id, data, tab) => {
    let url = getFilter(tab.url);
});

function checkDetails(details) {

    if (icon === STOP_ICON || !details) {
        return {
            cancel: false
        }
    }

    pageUrl = getFilter(details.initiator);

    const requestedHost = getFilter(details.url);

    let stop = false;
    if (pageUrl && requestedHost && pageUrl !== requestedHost) {
        //console.log(pageUrl + ' ' + requestedHost + ' ' + requestedHost.indexOf(pageUrl));
        const filteredHostsList = host => {
            const filteredHost = getFilter(host);
            // console.log(`${host}  .... ${filteredHost}`);
            if (filteredHost === requestedHost) {
                return true;
            }
            return false;
        };
        const isAllowed = allowedURLList.filter(filteredHostsList).length,
            isBlocked = blockedURLList.filter(filteredHostsList).length;

        // BE AFRAID, be very afraid
        // using the allowedURLList means that only domains in this list will be accessible by the browser
        // this is ONLY useful when testing your site for SPOF and you want to intentionally block all third 
        // parties but are not sure what all the third parties are.
        if (allowedURLList.length > 0 && isAllowed === 0) {
            console.log(`NOT ALLOWED: Cancelling request to: ${details.url} and parsed domain: ${requestedHost}.`);
            stop = true;
        }
        if (blockedURLList.length > 0 && isBlocked > 0) {
            console.log(`BLOCKED: Cancelling request to: ${details.url} and parsed domain: ${requestedHost}.`);
            stop = true;
        }
    }

    return {
        cancel: stop
    };
}

navRequests.onCreatedNavigationTarget.addListener((details) => {
    checkDetails(details);
    return {
        cancel: false
    };
}, URL_FILTER);

requests.onBeforeRequest.addListener(checkDetails, URL_FILTER, (icon === GO_ICON ? ['blocking'] : undefined));

chrome.browserAction.onClicked.addListener((tabs) => {

    if (icon === GO_ICON) {
        icon = STOP_ICON;
    } else {
        icon = GO_ICON;
    }
    chrome.browserAction.setIcon({
        'path': icon
    });
    //console.log(icon);
});
const requests = chrome.webRequest,
    navRequests = chrome.webNavigation,
    PROTOCOL_SEP = '://',
    GO_ICON = 'images/go32.png',
    STOP_ICON = 'images/stop32.png',
    URL_FILTER = {
        urls: ['https://*/*', 'http://*/*']
    },
    allowedAlways = [
        's.btstatic.com',
        'thebrighttag.com',
        'go-mpulse.net',
        'akstat.io'
    ];

let pageUrl,
    icon = GO_ICON;

function parseHostProtocol(inUrl) {
    if (!inUrl) {
        return {};
    }

    let host = inUrl.split(PROTOCOL_SEP),
        protocol;
    if (!host) {
        return {};
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
    if (idx > 0) {
        // remove everything after the first remaining /
        // ie foo.com/ becomes foo.com
        host = host.substring(0, idx);
    }

    const hostParts = host.split('.');
    if (hostParts.length > 2) {
        host = hostParts[hostParts.length - 2] + '.' + hostParts[hostParts.length - 1];
    }
    return {
        host,
        protocol
    };
    f
}

function getFilter(url) {
    let pageUrl;
    if (url) {
        let {
            host, protocol
        } = parseHostProtocol(url);
        if (host && protocol) {
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
        if (requestedHost.indexOf(pageUrl) === -1) {
            //console.log(pageUrl + ' ' + requestedHost + ' ' + requestedHost.indexOf(pageUrl));
            const isAllowed = allowedAlways.filter(host => {
                const filteredHostParts = host.split(/\./),
                    flen = filteredHostParts.length,
                    filteredHost = filteredHostParts[flen - 2] + '.' + filteredHostParts[flen - 1];
                if (filteredHost === requestedHost) {
                    return true;
                }
                return false;
            }).length;
            if (!isAllowed) {
                console.log(`Cancelling request to: ${details.url}`);
                stop = true;
            }
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

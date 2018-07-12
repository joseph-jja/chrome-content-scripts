const requests = chrome.webRequest,
    navRequests = chrome.webNavigation,
    PROTOCOL_SEP = '://',
    GO_ICON = 'images/go32.png',
    STOP_ICON = 'images/stop32.png',
    URL_FILTER = {
        urls: ['https://*/*', 'http://*/*']
    },
    urlAllowBlockList = [],
    isAllowMode = true;

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
        //console.log(pageUrl + ' ' + requestedHost + ' ' + requestedHost.indexOf(pageUrl));
        const isInList = urlAllowBlockList.filter(host => {
            const filteredHost = getFilter(host);
            if (filteredHost === requestedHost) {
                return true;
            }
            return false;
        }).length;
        if (isInList > 0) {
            console.log(`Cancelling request to: ${details.url}`);
            stop = !isAllowMode;
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

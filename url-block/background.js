const requests = chrome.webRequest,
    navRequests = chrome.webNavigation,
    PROTOCOL_SEP = '://',
    GO_ICON = 'images/go32.png',
    STOP_ICON = 'images/stop32.png',
    URL_FILTER = {
        urls: ['https://*/*', 'http://*/*']
    },
    DEFAULT_TAB_URL = 'chrome://newtab/';

let icon = GO_ICON,
    activeTabsList = {},
    allowedURLs = {};

function parseHostProtocol(inUrl) {
    if (!inUrl) {
        return {};
    }

    let host, protocol, domainlessHost;

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

    if (host && host.length > 0) {
        const hostParts = host.split('.');
        if (hostParts.length > 0) {
            // www.foo.com then we want foo.com and foo
            domainlessHost = hostParts[hostParts.length - 2];
        }
    }

    // return fqdn (fully qualified domain name)
    return {
        host,
        protocol,
        domainlessHost
    };
}

function getFilter(url, justName = false) {
    let pageUrl;
    if (url) {
        let {
            host,
            protocol,
            domainlessHost
        } = parseHostProtocol(url);

        // we don't always have protocol
        if (justName && domainlessHost) {
            pageUrl = domainlessHost;
        } else if (host) {
            pageUrl = host;
        }
    }
    return pageUrl;
}

// generic function to get the active tab and the url
function setActiveTab(tabId, key) {
    if (!tabId) {
        return;
    }
    chrome.tabs.get(tabId, (tab) => {
        if (tab.url && tab.url !== DEFAULT_TAB_URL) {
            let url = getFilter(tab.url);
            activeTabsList[tab.id] = url;
        }
    });
}

function initialize(tab) {
    const tabID = tab.id;
    setActiveTab(tabID, 'Created:');
    chrome.storage.local.get('urlBlockerData', function(items) {

        if (items && items.urlBlockerData) {
            const urlBlockerData = items.urlBlockerData;

            if (urlBlockerData && urlBlockerData.allowed) {
                const allowedItems = urlBlockerData.allowed;
                allowedURLs = allowedItems;
            }
        }
    });
}

chrome.tabs.onCreated.addListener(initialize);
chrome.tabs.onActivated.addListener(initialize);

chrome.tabs.onUpdated.addListener((tabID, data, tab) => {
    setActiveTab(tabID, 'Updated:');
});

chrome.tabs.onRemoved.addListener((tabID, removeInfo) => {
    delete activeTabsList[tabID];
});

function checkDetails(details) {

    if (icon === STOP_ICON || !details) {
        return {
            cancel: false
        }
    }

    const pageUrl = getFilter(details.initiator, true),
        requestedHost = getFilter(details.url),
        tabID = details.tabId;

    let stop = false;
    if (pageUrl && requestedHost && requestedHost.indexOf(pageUrl) < 0 && activeTabsList[tabID]) {

        stop = true;

        const filterdName = getFilter(requestedHost, true),
            filteredHost = getFilter(requestedHost);

        const splitHost = filteredHost.split('.');
        const baseHost = splitHost[splitHost.length - 2] + '.' +  splitHost[splitHost.length - 1];

        // so here you can say for site x always allow these domains
        // this can be fo foo.com or www.my.foo.com
        //console.log('baseHost ' + baseHost);
        //console.log(filterdName + ' ' + allowedURLs.includes(filterdName) +
        //    ' - ' + filteredHost + ' ' + allowedURLs.includes(filteredHost));
        if ((allowedURLs.includes(filterdName) &&
                requestedHost.indexOf(filterdName) > -1) ||
                (allowedURLs.includes(baseHost) &&
                        requestedHost.indexOf(baseHost) > -1) ||
            allowedURLs.includes(filteredHost)) {
            stop = false;
        }
    }

    if (stop) {
        console.log(`Page request from domain ${pageUrl} is blocking rquest to ${requestedHost}`);
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

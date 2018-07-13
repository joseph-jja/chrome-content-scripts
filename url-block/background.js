const requests = chrome.webRequest,
    navRequests = chrome.webNavigation,
    PROTOCOL_SEP = '://',
    GO_ICON = 'images/go32.png',
    STOP_ICON = 'images/stop32.png',
    URL_FILTER = {
        urls: ['https://*/*', 'http://*/*']
    },
    useFQDN = false,
    DEFAULT_TAB_URL = 'chrome://newtab/';

let icon = GO_ICON,
    activeTabsList = {},
    allowedURLs = {},
    blockedUrls = {},
    alwaysBlockedUrls = [];

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
            host,
            protocol
        } = parseHostProtocol(url);

        // we don't always have protocol
        if (host) {
            pageUrl = host;
        }
    }
    return pageUrl;
}

// generic function to get the active tab and the url
function setActiveTab(tabId, key) {
    chrome.tabs.get(tabId, (tab) => {
        if (tab.url && tab.url !== DEFAULT_TAB_URL) {
            let url = getFilter(tab.url);
            activeTabsList[tab.id] = url;
        }
    });
}

chrome.tabs.onCreated.addListener((tab) => {
    const tabID = tab.id;
    setActiveTab(tabID, 'Created:');
    chrome.storage.local.get('urlBlockerData', function(items) {

        if (items && items.urlBlockerData) {
            storageItems = items;

            const urlBlockerData = storageItems.urlBlockerData

            if (urlBlockerData && urlBlockerData.blocked) {
                const blockedItems = urlBlockerData.blocked;
                alwaysBlockedUrls = blockedItems;
            }

            if (urlBlockerData && urlBlockerData.alwaysBlocked) {
                const blockedItems = urlBlockerData.alwaysBlocked;
                blockedUrls = blockedItems;
            }

            if (urlBlockerData && urlBlockerData.alwaysAllowed) {
                const allowedItems = urlBlockerData.alwaysAllowed;
                allowedURLs = allowedItems;
            }
        }
    });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    const tabID = activeInfo.tabId;
    setActiveTab(tabID, 'Activated:');
});

chrome.tabs.onUpdated.addListener((id, data, tab) => {
    const tabID = id;
    //console.log(data);
    //console.log(tab);
    setActiveTab(tabID, 'Updated:');
});

chrome.tabs.onRemoved.addListener((tabID, removeInfo) => {
    delete activeTabsList[tabID];
    //chrome.tabs.query({}, (allTabs) => { });
});

function checkDetails(details) {

    if (icon === STOP_ICON || !details) {
        return {
            cancel: false
        }
    }

    const pageUrl = getFilter(details.initiator),
        requestedHost = getFilter(details.url),
        tabID = details.tabId;

    let stop = false;
    if (pageUrl && requestedHost && pageUrl !== requestedHost && activeTabsList[tabID]) {

        //console.log(pageUrl + ' ' + requestedHost + ' ' + requestedHost.indexOf(pageUrl));
        const filteredHostsList = host => {
            const filteredHost = getFilter(host);
            // console.log(`${host}  .... ${filteredHost}`);
            if (filteredHost === requestedHost) {
                return true;
            }
            return false;
        };

        let isAllowed = true,
            isBlocked = false,
            allowedURLList = [],
            blockedURLList = [];

        // so here you can say for site x always allow these domains
        if (allowedURLs[pageUrl]) {
            allowedURLList = allowedURLs[pageUrl];
            isAllowed = (allowedURLList.filter(filteredHostsList).length > 0);
        }

        // here you can specify for site x always block these domains
        // so if a url is already in the allowedURLs this code will be run
        // AND override the isAllowed, see below
        if (blockedUrls[pageUrl]) {
            blockedURLList = blockedUrls[pageUrl];
            isBlocked = (blockedURLList.filter(filteredHostsList).length > 0);
        }

        // putting a url in alwaysBlocekedUrls, means that this url will ALWAYS be blocked
        // so site x would never be loaded
        // for example, if you put google.com in this list, you would not be able to access
        // ANY of google.com domains
        // so if you block something by a domain, then no use hitting this
        if (alwaysBlockedUrls.length > 0 && !isBlocked) {
            isBlocked = (alwaysBlockedUrls.filter(filteredHostsList).length > 0);
        }

        if (allowedURLList.length > 0 && !isAllowed) {
            //console.log(`NOT ALLOWED: Cancelling request to: ${details.url} and parsed domain: ${requestedHost}.`);
            stop = true;
        }
        if ((alwaysBlockedUrls.length > 0 || blockedURLList.length > 0) && isBlocked) {
            //console.log(`BLOCKED: Cancelling request to: ${details.url} and parsed domain: ${requestedHost}.`);
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

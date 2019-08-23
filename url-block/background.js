const requests = chrome.webRequest,
    navRequests = chrome.webNavigation,
    PROTOCOL_SEP = '://',
    GO_ICON = 'images/go32.png',
    STOP_ICON = 'images/stop32.png',
    URL_FILTER = {
        urls: ['<all_urls>']
    },
    DEFAULT_TAB_URL = 'chrome://newtab/';

let icon = GO_ICON,
    activeTabsList = {},
    allowedURLs = [],
    isEnabled = true;

const blockedDetails = {};

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
    // delete the data for the tab that no longer exists
    delete blockedDetails[tabID];
});

function checkDetails(details) {

    if (!isEnabled) {
        return {
            cancel: false
        }
    }

    // for simplicity just look at hosts
    const pageUrl = getFilter(details.initiator, true),
        requestedHost = getFilter(details.url),

        tabID = details.tabId;

    /*if ( details.frameId && details.frameId > 0 ) {
        console.log(`Frame ID ${details.frameId} ${pageUrl}`);
        return {
            cancel: true
        };
    }*/
    if (!blockedDetails[details.tabId]) {
        blockedDetails[details.tabId] = {};
    }

    let stop = false;
    if (pageUrl && requestedHost && requestedHost.indexOf(pageUrl) < 0 && activeTabsList[tabID]) {

        stop = true;

        // for simplicity just look at hosts
        const filterdName = getFilter(requestedHost, true),
            filteredHost = getFilter(requestedHost);

        const splitHost = filteredHost.split('.');
        const baseHost = splitHost[splitHost.length - 2] + '.' + splitHost[splitHost.length - 1];

        // so here you can say for site x always allow these domains
        // this can be fo foo.com or www.my.foo.com
        //console.log('baseHost ' + baseHost);
        //console.log(filterdName + ' ' + allowedURLs.includes(filterdName) +
        //    ' - ' + filteredHost + ' ' + allowedURLs.includes(filteredHost));
        for (let i = 0, end = allowedURLs.length; i < end; i++) {
            const xurl = allowedURLs[i];
            if (xurl.indexOf(filterdName) > -1 ||
                xurl.indexOf(baseHost) > -1 ||
                xurl.indexOf(filteredHost) > -1) {

                stop = false;
            }
        }
        console.log(pageUrl + ': ' + requestedHost + ' => ' + xurl + ' --- ' + filterdName + ' --- ' + baseHost + ' --- ' + filteredHost);
    }

    if (stop) {
        if (!blockedDetails[details.tabId][requestedHost]) {
            blockedDetails[details.tabId][requestedHost] = 0;
        }
        blockedDetails[details.tabId][requestedHost]++;
        console.log(`Page request from domain ${pageUrl} is blocking request to ${requestedHost}`);
    }

    return {
        cancel: stop
    };
}

navRequests.onBeforeNavigate.addListener(checkDetails);
navRequests.onCreatedNavigationTarget.addListener((details) => {
    return checkDetails(details);
}, URL_FILTER);

requests.onBeforeRequest.addListener(checkDetails, URL_FILTER, ['blocking']);

chrome.browserAction.setTitle({
    'title': 'URL Blocker: Enabled'
});

chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
      console.log(msg);
        if (msg.indexOf('URL Blocker: ') < 0) {
            port.postMessage(blockedDetails);
        } else {
            isEnabled = (msg.replace('URL Blocker:', '').trim() === 'Enabled');
        }
    });
});

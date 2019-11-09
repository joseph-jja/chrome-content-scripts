const requests = chrome.webRequest,
    navRequests = chrome.webNavigation,
    GO_ICON = 'images/go32.png',
    STOP_ICON = 'images/stop32.png',
    URL_FILTER = {
        urls: ['<all_urls>']
    },
    DEFAULT_TAB_URL = 'chrome://newtab/';

let icon = GO_ICON,
    activeTabsList = {},
    disallowed = [],
    isEnabled = true;

const allowedDetails = {};

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

            if (urlBlockerData && urlBlockerData.blocked) {
                const blockedItems = urlBlockerData.blocked;
                disallowed = blockedItems;
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
    delete allowedDetails[tabID];
});

function checkDetails(details) {

    if (!isEnabled) {
        return {
            cancel: false
        }
    }

    // about blank allow
    if (details.initiator === 'about:blank' || details.url === 'about:blank') {
        return {
            cancel: false
        }
    } 

    // in that case if there is a frameId > 0 then it is an iframe
    // so we are just denying them all
    if (details.frameId && details.frameId > 0) {
        //console.log(`Denying frameId: ${details.frameId}  requestedHost: ${requestedHost}`);
        return {
            cancel: true
        };
    }
    
    // get host and domainless host
    const pageUrlData = parseHostProtocol(details.initiator),
        requestedUrlData = parseHostProtocol(details.url);
    
    const pageUrl = pageUrlData.domainlessHost,
        requestedHost = requestedUrlData.host,
        tabID = details.tabId;
    
    if (!allowedDetails[tabID]) {
        allowedDetails[tabID] = {};
    }
    
    if (pageUrl && !allowedDetails[tabID][pageUrl]) {
        allowedDetails[tabID][pageUrl] = {};
    }

    let stop = false;
    if (pageUrl && requestedHost && requestedHost.indexOf(pageUrl) < 0) {

        // for simplicity just look at hosts
        const filterdName = getFilter(requestedHost, true),
            filteredHost = getFilter(requestedHost);

        const splitHost = filteredHost.split('.');
        const baseHost = splitHost[splitHost.length - 2] + '.' + splitHost[splitHost.length - 1];

        // so here you can say for site x always allow these domains
        // this can be fo foo.com or www.my.foo.com
        //console.log('baseHost ' + baseHost);
        //console.log(filterdName + ' ' + disallowed.includes(filterdName) +
        //    ' - ' + filteredHost + ' ' + disallowed.includes(filteredHost));
        const list = [];
        for (let i = 0, end = disallowed.length; i < end; i++) {
            const xurl = disallowed[i];
            if (xurl === filterdName ||
                baseHost.indexOf(xurl) > -1 ||
                filteredHost.indexOf(xurl) > -1) {

                stop = true;
            }
            list.push({
                'Page URL': pageUrl,
                'Request URL': requestedHost,
                'Disallowed URL': xurl,
                'Filtered Name': filterdName,
                'Base Host': baseHost,
                'Filtered Host': filteredHost
            });
        }
        //console.table(list);
    }

    // TODO chnage this to have allowed and blocked flags with countts
    /* 
    if (!allowedDetails[details.tabId][pageUrl]) {
        allowedDetails[details.tabId][pageUrl] = {
             blocked: {}, 
             allowed: {}
        };
    }
    */
    if (stop) {
        console.log(`Page request from domain ${pageUrl} is BLOCKING requests to ${requestedHost}`);
        /*
        if (!allowedDetails[details.tabId][pageUrl].blocked[requestedHost]) {
            allowedDetails[details.tabId][pageUrl].blocked[requestedHost] = 0;
        }
        allowedDetails[details.tabId][pageUrl].blocked[requestedHost]++;
        */
    } else if (requestedHost !== 'about:blank') {
        if (!allowedDetails[tabID][pageUrl][requestedHost]) {
            allowedDetails[tabID][pageUrl][requestedHost] = 0;
        }
        allowedDetails[tabID][pageUrl][requestedHost]++;
        //console.log(`Page request from domain ${pageUrl} is allowing request to ${requestedHost}`);
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
            port.postMessage(allowedDetails);
        } else {
            isEnabled = (msg.replace('URL Blocker:', '').trim() === 'Enabled');
        }
    });
});

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
    allowed = {
        'facebook': [ 'fbcdn' ]
    },
    blocked = {
        'aquabid': [ 'doubleclick.net' ]
    },
    isEnabled = true;

const alwaysBlocked = [
    'demdex.net',
    'inside-graph.com',
    'btstatic.com',
    'pro-market.net',
    'addthis.com',
    'advertising.com',
    'adnxs.com',
    'scorecardresearch.com',
    'bluekai.com',
    'tremorhub.com',
    'mathtag.com'
];

const allowedDetails = {};

// generic function to get the active tab and the url
function setActiveTab(tabId, key) {
    if (!tabId) {
        return;
    }
    chrome.tabs.get(tabId, (tab) => {
        if (tab.url && tab.url !== DEFAULT_TAB_URL) {
            let url = parseHostProtocol(tab.url).host;
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

            if (urlBlockerData) {
                if (urlBlockerData.allowed) {
                    const allowedItems = urlBlockerData.allowed;
                    allowed = allowedItems;
                }
                if (urlBlockerData.blocked) {
                    const blockedItems = urlBlockerData.blocked;
                    blocked = blockedItems;
                }
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
    
    const pageHost = pageUrlData.host,
        pageDomain = pageUrlData.domainlessHost,
        requestedHost = requestedUrlData.host,
        requestedDomain = requestedUrlData.domainlessHost,
        requestedFQDN = requestedUrlData.fqdnDomainHost,
        tabID = details.tabId;
    
    if (!allowedDetails[tabID]) {
        allowedDetails[tabID] = {};
    }
    
    if (pageHost && !allowedDetails[tabID][pageHost]) {
        allowedDetails[tabID][pageHost] = {
            blocked: {}, 
            allowed: {} 
        };
    }
    
    // no page host, so this is the main initiator
    // since we do not do iframes
    if (!pageHost) {
        //console.log(`Requested ${requestedHost}`); 
        // first request?
        return {
            cancel: false
        };
    }

    if (requestedHost && pageHost === requestedHost) {
        return {
            cancel: false
        };        
    }
    
    let stop = false;
    
    if (alwaysBlocked.includes(requestedFQDN)) {
        stop = true;
    }
    
    if (!stop && requestedHost && pageDomain && requestedDomain) {
        
        const pagesAllowed = allowed[pageDomain], 
              pagesBlocked = blocked[pageDomain];
        if(pagesAllowed) {
            for (const allowedHost of pagesAllowed) {
                const allowedDomain = parseHostProtocol(allowedHost).domainlessHost;
                if (allowedDomain === requestedDomain) {
                    stop = false;
                } 
            }
        }
        if(pagesBlocked) {
            for (const blockedHost of pagesBlocked) {
                const blockedDomain = parseHostProtocol(blockedHost).domainlessHost;
                if (blockedDomain === requestedDomain) {
                    stop = true;
                } 
            }
        }
    }

    // data is either blocked or allowed
    if (stop) {
        //console.log(`Page request from domain ${pageHost} is BLOCKING requests to ${requestedHost}`);
        if (!allowedDetails[details.tabId][pageHost].blocked[requestedHost]) {
            allowedDetails[details.tabId][pageHost].blocked[requestedHost] = 0;
        }
        allowedDetails[details.tabId][pageHost].blocked[requestedHost]++;
    } else {
        if (!allowedDetails[tabID][pageHost].allowed[requestedHost]) {
            allowedDetails[tabID][pageHost].allowed[requestedHost] = 0;
        }
        allowedDetails[tabID][pageHost].allowed[requestedHost]++;
        //console.log(`Page request from domain ${pageHost} is allowing request to ${requestedHost}`);
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

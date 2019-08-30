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
    if (!allowedDetails[details.tabId]) {
        allowedDetails[details.tabId] = {};
    }

    let stop = false;
    if (pageUrl && requestedHost && requestedHost.indexOf(pageUrl) < 0 && activeTabsList[tabID]) {

        stop = false;

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
        for (let i = 0, end = disallowed.length; i < end; i++) {
            const xurl = disallowed[i];
            if (xurl.indexOf(filterdName) > -1 ||
                xurl.indexOf(baseHost) > -1 ||
                xurl.indexOf(filteredHost) > -1) {

                stop = true;
            }
            //console.log(pageUrl + ': ' + requestedHost + ' => ' + xurl + ' --- ' + filterdName + ' --- ' + baseHost + ' --- ' + filteredHost);
        }
    }

    if (stop) {
        console.log(`Page request from domain ${pageUrl} is BLOCKING requests to ${requestedHost}`);
    } else if (requestedHost !== 'about:blank') {
        if (!allowedDetails[details.tabId][pageUrl]) {
            allowedDetails[details.tabId][pageUrl] = {};
        }
        if (!allowedDetails[details.tabId][pageUrl][requestedHost]) {
            allowedDetails[details.tabId][pageUrl][requestedHost] = 0;
        }
        allowedDetails[details.tabId][pageUrl][requestedHost]++;
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

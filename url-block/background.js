const requests = chrome.webRequest,
//     navRequests = chrome.webNavigation,
//     GO_ICON = 'images/go32.png',
//     STOP_ICON = 'images/stop32.png',
     URL_FILTER = {
         urls: ['<all_urls>']
     },
     DEFAULT_TAB_URL = 'chrome://newtab/';

// let icon = GO_ICON,
//     activeTabsList = {},
//     allowed = {
//         'facebook': ['fbcdn']
//     },
//     blocked = {
//         'aquabid': ['doubleclick.net'],
//         'slashdot': ['doubleclick.net']
//     },
//     isEnabled = true;

// const alwaysBlocked = [
//     'demdex.net',
//     'inside-graph.com',
//     'btstatic.com',
//     'pro-market.net',
//     'addthis.com',
//     'advertising.com',
//     'adnxs.com',
//     'scorecardresearch.com',
//     'bluekai.com',
//     'tremorhub.com',
//     'mathtag.com',
//     'letsmakeparty3.ga',
//     'advertserve.com'
// ];

// const allowedDetails = {};

// // generic function to get the active tab and the url
// function setActiveTab(tabId, key) {
//     if (!tabId) {
//         return;
//     }
//     chrome.tabs.get(tabId, (tab) => {
//         if (tab.url && tab.url !== DEFAULT_TAB_URL) {
//             let url = parseHostProtocol(tab.url).host;
//             activeTabsList[tab.id] = url;
//         }
//     });
// }

// function initialize(tab) {
//     const tabID = tab.id;
//     setActiveTab(tabID, 'Created:');
//     chrome.storage.local.get('urlBlockerData', function(items) {

//         if (items && items.urlBlockerData) {
//             const urlBlockerData = items.urlBlockerData;

//             if (urlBlockerData) {
//                 if (urlBlockerData.allowed) {
//                     const allowedItems = urlBlockerData.allowed;
//                     allowed = allowedItems;
//                 }
//                 if (urlBlockerData.blocked) {
//                     const blockedItems = urlBlockerData.blocked;
//                     blocked = blockedItems;
//                 }
//             }
//         }
//     });
// }

// chrome.tabs.onCreated.addListener(initialize);
// chrome.tabs.onActivated.addListener(initialize);

// chrome.tabs.onUpdated.addListener((tabID, data, tab) => {
//     setActiveTab(tabID, 'Updated:');
// });

// chrome.tabs.onRemoved.addListener((tabID, removeInfo) => {
//     delete activeTabsList[tabID];
//     // delete the data for the tab that no longer exists
//     delete allowedDetails[tabID];
// });

function checkDetails(details) {

    console.log(details.url, details.responseHeaders);

    return undefined;
}

// navRequests.onBeforeNavigate.addListener(checkDetails);
// navRequests.onCreatedNavigationTarget.addListener((details) => {
//     return checkDetails(details);
// }, URL_FILTER);

requests.onHeadersReceived.addListener(checkDetails, URL_FILTER, ['responseHeaders', 'extraHeaders']);

// chrome.browserAction.setTitle({
//     'title': 'URL Blocker: Enabled'
// });

// chrome.extension.onConnect.addListener(function(port) {
//     port.onMessage.addListener(function(msg) {
//         console.log(msg);
//         if (msg.indexOf('URL Blocker: ') < 0) {
//             port.postMessage(allowedDetails);
//         } else {
//             isEnabled = (msg.replace('URL Blocker:', '').trim() === 'Enabled');
//         }
//     });
// });

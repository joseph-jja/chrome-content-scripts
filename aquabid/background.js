const requests = chrome.webRequest,
    navRequests = chrome.webNavigation,
    URL_FILTER = {
        urls: ['<all_urls>']
    };

function checkDetails(details) {

    if (!details.initiator) {
        console.log(details);
    }
   
    if (details.frameId > 0) { 
        console.log(details);
    }

    return {
        cancel: false
    };
}

navRequests.onBeforeNavigate.addListener(checkDetails);
navRequests.onCreatedNavigationTarget.addListener((details) => {
    return checkDetails(details);
}, URL_FILTER);

requests.onBeforeRequest.addListener(checkDetails, URL_FILTER, ['blocking']);


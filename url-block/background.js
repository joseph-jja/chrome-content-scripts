const requests = chrome.webRequest,
    navRequests = chrome.webNavigation,
    PROTOCOL_SEP = '://',
    GO_ICON = 'images/go32.png',
    STOP_ICON = 'images/stop32.png',
    URL_FILTER = {
        urls: ['https://*/*', 'http://*/*']
    };

let pageUrl,
    icon = GO_ICON;

function parseHostProtocol(inUrl) {
    if (!inUrl) {
        return {};
    }
    let host = inUrl.split(PROTOCOL_SEP),
        protocol;
    if (host && host.length > 1) {
        protocol = host[0];
        host = host[1];
        const idx = host.indexOf('/')
        if (idx > 0) {
            host = host.substring(0, idx);
        }
        const hostParts = host.split('.');
        host = hostParts[hostParts.length - 2] + '.' + hostParts[hostParts.length - 1];
    }
    return {
        host,
        protocol
    }
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

navRequests.onCreatedNavigationTarget.addListener((details) => {

    if (icon === STOP_ICON || !details) {
        return {
            cancel: false
        }
    }

    pageUrl = getFilter(details.initiator);

    const requestedHost = getFilter(details.url);

    let stop = false;
    if (pageUrl && requestedHost && pageUrl !== requestedHost) {
        console.log(`Trying to cancel request to: ${details.url}`);
        stop = true;
    }

    return {
        cancel: stop
    };

}, URL_FILTER);

requests.onBeforeRequest.addListener((details) => {

    if (icon === STOP_ICON || !details) {
        return {
            cancel: false
        }
    }

    pageUrl = getFilter(details.initiator);

    const requestedHost = getFilter(details.url);

    let stop = false;
    if (pageUrl && requestedHost && pageUrl !== requestedHost) {
        console.log(`Cancelling request to: ${details.url}`);
        stop = true;
    }

    return {
        cancel: stop
    };

}, URL_FILTER, ['blocking']);

chrome.browserAction.onClicked.addListener((tabs) => {

    if (icon === GO_ICON) {
        icon = STOP_ICON;
    } else {
        icon = GO_ICON;
    }
    chrome.browserAction.setIcon({
        'path': icon
    });
    console.log(icon);

});

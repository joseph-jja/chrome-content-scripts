// onload get the list of blocked URLs

let storageItems = {
    urlBlockerData: {
        allowed: []
    }
};

const blockedDetails = {};

const port = chrome.extension.connect({
    name: 'Blocked URL Message Channel'
});
port.onMessage.addListener(function(msg) {
    //Object.keys(msg)
    //blockedDetails
    console.log(msg);
});
port.postMessage('Give me the URLs that have been blocked');

const GO_ICON = 'images/go32.png',
    STOP_ICON = 'images/stop32.png';

const enableButton = document.getElementById('enableDisable');
function enableDisableExtension() {

    chrome.browserAction.getTitle({}, (title) => {

        const text = title.replace('URL Blocker:', '').trim();

        let icon = GO_ICON,
            titleText = 'Disable';
        if (text === 'Enabled') {
            enableButton.innerHTML = 'Enable';
            icon = STOP_ICON;
            titleText = 'Disabled';
        } else if (text === 'Disabled') {
            enableButton.innerHTML = 'Disable';
            icon = GO_ICON;
            titleText = 'Enabled';
        }

        chrome.browserAction.setIcon({
            'path': icon
        });
        chrome.browserAction.setTitle({
            'title': 'URL Blocker: ' + titleText
        });

    });
}

enableButton.addEventListener('click', enableDisableExtension, false);

chrome.browserAction.getTitle({}, (title) => {

    const text = title.replace('URL Blocker:', '').trim();

    if (text === 'Enabled') {
        enableButton.innerHTML = 'Disable';
    } else if (text === 'Disabled') {
        enableButton.innerHTML = 'Enable';
    }
});
//chrome.storage.local.clear();

function updateStorage() {

    chrome.storage.local.set(storageItems,
        function(items) {

            if (items) {
                console.log(items);
            }
            //window.location.reload();
        });
}

function handleAddClick() {

    const allowedUrl = document.getElementById('allow-url-id');

    if (!allowedUrl.value) {
        return;
    }

    const abUrl = allowedUrl.value;

    const table = document.getElementById('display-results');

    storageItems.urlBlockerData.allowed.push(abUrl);
    updateStorage();
}

const addButton = document.getElementById('add-button');
addButton.addEventListener('click', handleAddClick, false);

function renderRow(tr, parts, domainName) {
    for (let j = 0, jend = parts.length; j < jend; j++) {
        const td = document.createElement('td');
        if (parts[j] === 'button') {
            const button = document.createElement('button');
            button.innerHTML = 'Delete';
            button.dataset.domainName = domainName;
            button.className = 'deleteDomain';
            td.appendChild(button);
        } else {
            td.innerHTML = parts[j];
        }
        tr.appendChild(td);
    }
}

document.addEventListener('DOMContentLoaded', restore_options => {
    const table = document.getElementById('display-results').tBodies[0];

    chrome.storage.local.get('urlBlockerData', function(items) {

        if (items && items.urlBlockerData) {
            storageItems = items;

            if (!items) {
                storageItems.urlBlockerData = {
                    allowed: []
                };
                return;
            }

            const urlBlockerData = storageItems.urlBlockerData;
            if (urlBlockerData.allowed) {
                const allowed = urlBlockerData.allowed;
                allowed.forEach(domainName => {
                    var tr = document.createElement('tr');
                    table.appendChild(tr);
                    renderRow(tr, [domainName, 'button'], domainName);
                });
            }
            table.addEventListener('click', (e) => {
                const tgt = e.target;
                const domainName = tgt.dataset['domainName'];
                if (!domainName) {
                    return;
                }
                // remove an allowed domain
                if (storageItems.urlBlockerData.allowed) {
                    const i = storageItems.urlBlockerData.allowed.indexOf(domainName);
                    if (i > -1) {
                        storageItems.urlBlockerData.allowed.splice(i, 1);
                        updateStorage();
                    }
                }
            });

        }
    });
});

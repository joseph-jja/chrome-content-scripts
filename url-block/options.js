// onload get the list of blocked URLs

let storageItems = {
    urlBlockerData: {
        blocked: []
    }
};

const allowedDetails = {};

const port = chrome.extension.connect({
    name: 'Blocked URL Message Channel'
});
port.onMessage.addListener(function(msg) {
    const table = document.getElementById('blocked-results');
    const rows = table.rows;
    for (let j = rows.length - 1; j > 0; j--) {
        table.removeChild(table.rows[j]);
    }
    chrome.tabs.query({
        active: true
    }, tabs => {
        try {
            if (tabs[0]) {
                const tabID = tabs[0].id,
                    tabURL =  getFilter(tabs[0].url, true);
                console.log(tabURL);
                if (msg[tabID] && msg[tabID][tabURL]) {
                    const blockedURLs = msg[tabID][tabURL];
                    Object.keys(blockedURLs).forEach(url => {
                        var tr = document.createElement('tr');
                        table.appendChild(tr);
                        // domain cell
                        const tddomain = document.createElement('td');
                        tddomain.innerHTML = url;
                        tr.appendChild(tddomain);
                        const tdcount = document.createElement('td');
                        tr.appendChild(tdcount);
                        tdcount.innerHTML = blockedURLs[url];
                    });
                }
            }
        } catch (e) {
            console.log(e);
        }
    });
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
        port.postMessage('URL Blocker: ' + titleText);
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

function handleAddClick() {

    const blockedUrl = document.getElementById('allow-url-id');

    if (!blockedUrl.value) {
        return;
    }

    const abUrl = blockedUrl.value;

    const table = document.getElementById('display-results');
    var tr = document.createElement('tr');
    table.appendChild(tr);
    renderRow(tr, [abUrl, 'button'], abUrl);

    storageItems.urlBlockerData.blocked.push(abUrl);
    updateStorage();
}

const addButton = document.getElementById('add-button');
addButton.addEventListener('click', handleAddClick, false);

document.addEventListener('DOMContentLoaded', restore_options => {
    const table = document.getElementById('display-results').tBodies[0];

    chrome.storage.local.get('urlBlockerData', function(items) {

        if (items && items.urlBlockerData) {
            storageItems = items;

            if (!items) {
                storageItems.urlBlockerData = {
                    blocked: []
                };
                return;
            }

            const urlBlockerData = storageItems.urlBlockerData;
            if (urlBlockerData.blocked) {
                const blocked = urlBlockerData.blocked;
                blocked.forEach(domainName => {
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
                // remove an blocked domain
                if (storageItems.urlBlockerData.blocked) {
                    const i = storageItems.urlBlockerData.blocked.indexOf(domainName);
                    if (i > -1) {
                        storageItems.urlBlockerData.blocked.splice(i, 1);
                        updateStorage();
                    }
                }
            });

        }
    });
});

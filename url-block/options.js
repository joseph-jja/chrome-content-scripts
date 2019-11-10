// onload get the list of blocked URLs

let storageItems = {
    urlBlockerData: {
        allowed: {},
        blocked: {}
    }
};

const port = chrome.extension.connect({
    name: 'Blocked URL Message Channel'
});
port.onMessage.addListener(function(msg) {
    const tableAllowed = document.getElementById('allowed-results'), 
         tableBlocked = document.getElementById('blocked-results');
    let rows = tableAllowed.rows;
    for (let j = rows.length - 1; j > 0; j--) {
        tableAllowed.removeChild(tableAllowed.rows[j]);
    }
    rows = tableBlocked.rows;
    for (let j = rows.length - 1; j > 0; j--) {
        tableBlocked.removeChild(tableBlocked.rows[j]);
    }
    chrome.tabs.query({
        active: true
    }, tabs => {
        try {
            if (tabs[0]) {
                const tabID = tabs[0].id,
                    tabURL =  parseHostProtocol(tabs[0].url, true).host;
                if (msg[tabID] && msg[tabID][tabURL]) {
                    const allowedURLs = msg[tabID][tabURL].allowed;
                    Object.keys(allowedURLs).forEach(url => {
                        var tr = document.createElement('tr');
                        tableAllowed.appendChild(tr);
                        
                        // domain cell
                        const tddomain = document.createElement('td');
                        tddomain.innerHTML = url;
                        tr.appendChild(tddomain);
                        
                        const tdcount = document.createElement('td');
                        tdcount.innerHTML = allowedURLs[url];
                        tr.appendChild(tdcount);
                        
                        const tddisable = document.createElement('td');
                        tr.appendChild(tdcount);
                        const button = document.createElement('button');
                        button.innerHTML = 'Block';
                        button.dataset.domainName = url;
                        button.className = 'blockDomain';
                        tddisable.appendChild(button);
                        tr.appendChild(tddisable);
                    });
                    const blockedURLs = msg[tabID][tabURL].blocked;
                    Object.keys(blockedURLs).forEach(url => {
                        var tr = document.createElement('tr');
                        tableBlocked.appendChild(tr);
                        
                        // domain cell
                        const tddomain = document.createElement('td');
                        tddomain.innerHTML = url;
                        tr.appendChild(tddomain);
                        
                        const tdcount = document.createElement('td');
                        tdcount.innerHTML = blockedURLs[url];
                        tr.appendChild(tdcount);
                        
                        const tdenable = document.createElement('td');
                        const button = document.createElement('button');
                        button.innerHTML = 'Allow';
                        button.dataset.domainName = url;
                        button.className = 'allowDomain';
                        tdenable.appendChild(button);
                        tr.appendChild(tdenable);
                    });
                }
            }
        } catch (e) {
            console.log(e);
        }
    });
});
port.postMessage('Give me the URLs that have been blocked');

function updateStorage() {
    
    chrome.storage.local.set(('urlBlockerData', storageItems),
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

async function getCurrentTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.getSelected(tab => {
            if (tab && tab.url) {
                resolve(tab.url);    
            } else {
                reject();
            }
        });
    });
}
                       
        
function handleEnableClick(e) {

    const tgt = e.target;

    if (tgt.nodeName.toLowerCase() !== 'button') {
        return;
    }    

    const abUrl = tgt.dataset.domainName;

    getCurrentTab().then(furl => {
        const url = parseHostProtocol(furl).host;
        if (!storageItems.urlBlockerData.allowed) {
            storageItems.urlBlockerData.allowed = {};
        }
        if (!storageItems.urlBlockerData.allowed[url]) {
            storageItems.urlBlockerData.allowed[url] = [];
        }

        const table = document.getElementById('enabled-results');
        var tr = document.createElement('tr');
        table.appendChild(tr);
        renderRow(tr, [abUrl, 'button'], abUrl);

        storageItems.urlBlockerData.allowed[url].push(abUrl);
        updateStorage();
    }, () => {});
}

//enabled-results
const enableButtons = document.getElementById('blocked-results');
enableButtons.addEventListener('click', handleEnableClick, false);

function handleAddClick(e) {
    const allowUrl = document.getElementById('allow-url');    
    
    getCurrentTab().then(furl => {
        const url = parseHostProtocol(furl).host;
        if (!storageItems.urlBlockerData.allowed) {
            storageItems.urlBlockerData.allowed = {};
        }
        if (!storageItems.urlBlockerData.allowed[url]) {
            storageItems.urlBlockerData.allowed = {};
            storageItems.urlBlockerData.allowed[url] = [];
        }
        
        const table = document.getElementById('enabled-results');
        var tr = document.createElement('tr');
        table.appendChild(tr);
        renderRow(tr, [allowUrl, 'button'], allowUrl);

        storageItems.urlBlockerData.allowed[url].push(allowUrl);
        updateStorage();
    }, () => {});
}

const addButton = document.getElementById('add-button');
enableButtons.addEventListener('click', handleAddClick, false);


document.addEventListener('DOMContentLoaded', restore_options => {
    const table = document.getElementById('blocked-results').tBodies[0];

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

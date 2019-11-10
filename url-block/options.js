// onload get the list of blocked URLs

let storageItems = {
    urlBlockerData: {
        allowed: {},
        blocked: {}
    }
};

function createTableRow(parentTable, 
    url, urlCounts, buttonText, buttonClass) {
    
    var tr = document.createElement('tr');
    parentTable.tBodies[0].appendChild(tr);
                        
    // domain cell
    const tddomain = document.createElement('td');
    tddomain.innerHTML = url;
    tr.appendChild(tddomain);
                        
    const tdcount = document.createElement('td');
    tdcount.innerHTML = urlCounts;
    tr.appendChild(tdcount);
                        
    const tdbutton = document.createElement('td');
    const button = document.createElement('button');
    button.innerHTML = buttonText;
    button.dataset.domainName = url;
    button.className = buttonClass;
    tdbutton.appendChild(button);
    tr.appendChild(tdbutton);
}

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
                        createTableRow(tableAllowed, url, allowedURLs[url], 'Block', 'blockDomain');
                    });
                    const blockedURLs = msg[tabID][tabURL].blocked;
                    Object.keys(blockedURLs).forEach(url => {
                        createTableRow(tableBlocked, url, blockedURLs[url], 'Allow', 'allowDomain');
                    });
                }
            }
        } catch (e) {
            console.log(e);
        }
    });
});
port.postMessage('Give me the URLs that have been blocked');

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
                
function updateStorage() {
    
    chrome.storage.local.set(('urlBlockerData', storageItems),
        function(items) {
            if (items) {
                console.log(items);
            }
        });
}

function handleAllowClick(e) {
    const tgt = e.target;
    if (tgt.nodeName.toLowerCase() !== 'button') {
        return;
    }    
    const allowUrl = tgt.dataset.domainName;
    
    getCurrentTab().then(furl => {
        const url = parseHostProtocol(furl).host;
        if (!storageItems.urlBlockerData.allowed) {
            storageItems.urlBlockerData.allowed = {};
        }
        if (!storageItems.urlBlockerData.allowed[url]) {
            storageItems.urlBlockerData.allowed[url] = [];
        }

        const tableAllowed = document.getElementById('allowed-results');
        createTableRow(tableAllowed, allowUrl, 0, 'Block', 'blockDomain');
        
        // delete row from blocked
        const row = tgt.parentNode.parentNode;
        const rowParent = row.parentNode;
        rowParent.removeChild(row);

        storageItems.urlBlockerData.allowed[url].push(allowUrl);
        updateStorage();
    }, () => {});


}
const allowButtons = document.getElementById('blocked-results');
allowButtons.addEventListener('click', handleAllowClick, false);

function handleBlockClick(e) {
    const tgt = e.target;
    if (tgt.nodeName.toLowerCase() !== 'button') {
        return;
    }    
    const blockUrl = tgt.dataset.domainName;
    
    getCurrentTab().then(furl => {
        const url = parseHostProtocol(furl).host;
        if (!storageItems.urlBlockerData.allowed) {
            storageItems.urlBlockerData.allowed = {};
        }
        if (!storageItems.urlBlockerData.allowed[url]) {
            storageItems.urlBlockerData.allowed[url] = [];
        }

        const tableBlocked = document.getElementById('blocked-results');
        createTableRow(tableBlocked, blockUrl, 0, 'Allow', 'allowDomain');
        
        // delete row from allowed
        const row = tgt.parentNode.parentNode;
        const rowParent = row.parentNode;
        rowParent.removeChild(row);

        storageItems.urlBlockerData.blocked[url].push(blockUrl);
        updateStorage();
    }, () => {});
}
const blockButtons = document.getElementById('allowed-results');
blockButtons.addEventListener('click', handleBlockClick, false);


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

    chrome.storage.local.get('urlBlockerData', function(items) {

        if (items && items.urlBlockerData) {
            storageItems = items;

            if (!items) {
                storageItems.urlBlockerData = {
                    allowed: {},
                    blocked: {}
                };
                return;
            }
            
            getCurrentTab().then(furl => {
                const url = parseHostProtocol(furl).host;

                const urlBlockerData = storageItems.urlBlockerData;

                const blockedTable = document.getElementById('blocked-results');
                if (urlBlockerData.blocked) {
                    const blocked = urlBlockerData.blocked[url];
                    if (blocked) {
                        blocked.forEach(domainName => {
                            createTableRow(blockedTable, 
                                   domainName, 0, 'Allow', 'allowDomain');
                        });
                    }
                }

                const allowedTable = document.getElementById('allowed-results');
                if (urlBlockerData.allowed) {
                    const allowed = urlBlockerData.allowed[url];
                    if (allowed) {
                        allowed.forEach(domainName => {
                            createTableRow(allowedTable, 
                                   domainName, 0, 'Block', 'blockDomain');
                        });
                    }
                }
            }, () => {});
        }
    });
});

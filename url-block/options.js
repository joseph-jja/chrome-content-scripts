// onload get the list of blocked URLs

let storageItems = {};

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

    const parentDomain = document.getElementById('parent-domain-url-id'),
        allowBlockUrl = document.getElementById('allow-block-url-id'),
        allowedBlocked = document.getElementById('allow-block-id');

    if (!allowBlockUrl.value) {
        //Blocked
        return;
    }

    const abUrl = allowBlockUrl.value;

    const table = document.getElementById('display-results');

    if (parentDomain.value) {
        // so if we have a parent domain then we can do certain things
        const mapKey = parentDomain.value;

        const urlBlockerData = storageItems.urlBlockerData;
        if (!urlBlockerData || !storageItems.urlBlockerData.alwaysAllowed) {
            storageItems.urlBlockerData = {
                'alwaysAllowed': {}
            };
        }

        if (!urlBlockerData || !storageItems.urlBlockerData.alwaysBlocked) {
            storageItems.urlBlockerData = {
                'alwaysBlocked': {}
            };
        }

        if (allowedBlocked.checked) {
            let key = storageItems.urlBlockerData.alwaysBlocked[mapKey];
            if (!key) {
                storageItems.urlBlockerData.alwaysBlocked[mapKey] = [];
            }
            storageItems.urlBlockerData.alwaysBlocked[mapKey].push(abUrl);
        } else {
            let key = storageItems.urlBlockerData.alwaysAllowed[mapKey];
            if (!key) {
                storageItems.urlBlockerData.alwaysAllowed[mapKey] = [];
            }
            storageItems.urlBlockerData.alwaysAllowed[mapKey].push(abUrl);
        }
        updateStorage();
    } else {
        const urlBlockerData = storageItems.urlBlockerData;
        if (!urlBlockerData || storageItems.urlBlockerData.blocked) {
            if (!storageItems.urlBlockerData) {
                storageItems.urlBlockerData = {};  
            }
            storageItems.urlBlockerData['blocked'] = [];
        }
        storageItems.urlBlockerData.blocked.push(abUrl);
        updateStorage();
    }
}

const addButton = document.getElementById('add-button');
addButton.addEventListener('click', handleAddClick, false);

function renderRow(tr, parts, parent, domainName, isAllow) {
    for (let j = 0, jend = parts.length; j < jend; j++) {
        const td = document.createElement('td');
        if (parts[j] === 'button') {
            const button = document.createElement('button');
            button.innerHTML = 'Delete';
            button.dataset.parentDomainName = parent;
            button.dataset.domainName = domainName;
            button.dataset.allowed = (isAllow ? 'a' : 'b');
            button.className = 'deleteBlockedDataDomain';
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

            const urlBlockerData = storageItems.urlBlockerData
            if (!urlBlockerData) {
                return;
            }

            if (urlBlockerData.blocked) {
                const blockedItems = urlBlockerData.blocked;
                for (let i = 0, end = blockedItems.length; i < end; i++) {
                    var tr = document.createElement('tr');
                    table.appendChild(tr);
                    const domainName = blockedItems[i];
                    const parts = ['', domainName, 'Blocked', 'button'];
                    renderRow(tr, parts, '', domainName, false);
                }
            }
            if (urlBlockerData.alwaysBlocked) {
                const blockedItems = urlBlockerData.alwaysBlocked;
                const keys = Object.keys(blockedItems);
                for (let i = 0, end = keys.length; i < end; i++) {
                    const domains = blockedItems[keys[i]];
                    for (let m = 0, mend = domains.length; m < mend; m++) {
                        var tr = document.createElement('tr');
                        table.appendChild(tr);
                        const domainName = domains[m];
                        const parts = [keys[i], domainName, 'Blocked', 'button'];
                        renderRow(tr, parts, keys[i], domainName, false);
                    }
                }
            }
            if (urlBlockerData.alwaysAllowed) {
                const allowedItems = urlBlockerData.alwaysAllowed;
                const keys = Object.keys(allowedItems);
                for (let i = 0, end = keys.length; i < end; i++) {
                    const domains = allowedItems[keys[i]];
                    for (let m = 0, mend = domains.length; m < mend; m++) {
                        var tr = document.createElement('tr');
                        table.appendChild(tr);
                        const domainName = domains[m];
                        const parts = [keys[i], domainName, 'Allowed', 'button'];
                        renderRow(tr, parts, keys[i], domainName, true);
                    }
                }
            }
            table.addEventListener('click', (e) => {
                const tgt = e.target;
                const domainName = tgt.dataset['domainName'];
                if (!domainName) {
                    return;
                }
                // parent domain name?
                const parentDomainName = tgt.dataset['parentDomainName'];
                if (parentDomainName) {
                    const isAllowed = (tgt.dataset['allowed'] === 'a');
                    const storageArea = storageItems.urlBlockerData[(isAllowed ? 'alwaysAllowed' : 'alwaysBlocked')];
                    const parentDomain = storageArea[parentDomainName];
                    const i = parentDomain.indexOf(domainName);
                    if (i > -1) {
                        parentDomain.splice(i, 1);
                        storageArea[parentDomainName] = parentDomain;
                        updateStorage();
                    }
                } else {
                    // FIXME for different storage types
                    if (storageItems.urlBlockerData.blocked) {
                        const i = storageItems.urlBlockerData.blocked.indexOf(domainName);
                        if (i > -1) {
                            storageItems.urlBlockerData.blocked.splice(i, 1);
                            updateStorage();
                        }
                    }
                }
            });

        }
    });
});

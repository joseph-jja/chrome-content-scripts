// onload get the list of blocked URLs

let storageItems = {};

//chrome.storage.local.clear();

function updateStorage() {

    chrome.storage.local.set({
            'urlBlockerData': storageItems.urlBlockerData
        },
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
        return;
    }

    const abUrl = allowBlockUrl.value;

    const table = document.getElementById('display-results');

    if (parentDomain.value) {
        // so if we have a parent domain then we can do certain things
        const mapKey = parentDomain.value;

        let alwaysAllow = true;
        if (allowedBlocked.checked) {
            alwaysAllow = allowedBlocked.checked;
        }
    } else {
        const urlBlockerData = storageItems.urlBlockerData;
        if (!urlBlockerData) {
            storageItems.urlBlockerData = {
                'blocked': []
            };
        }
        storageItems.urlBlockerData.blocked.push(abUrl);
        updateStorage();
    }
}

const addButton = document.getElementById('add-button');
addButton.addEventListener('click', handleAddClick, false);

document.addEventListener('DOMContentLoaded', restore_options => {
    const table = document.getElementById('display-results').tBodies[0];

    chrome.storage.local.get('urlBlockerData', function(items) {

        if (items && items.urlBlockerData) {
            storageItems = items;

            const urlBlockerData = storageItems.urlBlockerData

            if (urlBlockerData && urlBlockerData.blocked) {
                const blockedItems = urlBlockerData.blocked;
                for (let i = 0, end = blockedItems.length; i < end; i++) {
                    var tr = document.createElement('tr');
                    table.appendChild(tr);
                    const domainName = blockedItems[i];
                    const parts = ['', domainName, 'Blocked', 'button'];
                    for (let j = 0, jend = parts.length; j < jend; j++) {
                        const td = document.createElement('td');
                        if (parts[j] === 'button') {
                            const button = document.createElement('button');
                            button.innerHTML = 'Delete';
                            button.dataset.domainName = domainName;
                            button.className = 'deleteBlockedDataDomain';
                            td.appendChild(button);
                        } else {
                            td.innerHTML = parts[j];
                        }
                        tr.appendChild(td);

                    }
                }
            }
            table.addEventListener('click', (e) => {
                const tgt = e.target;
                const domainName = tgt.dataset['domainName'];
                if (!domainName) {
                    return;
                }
                const i = storageItems.urlBlockerData.blocked.indexOf(domainName);
                if (i > -1) {
                    storageItems.urlBlockerData.blocked.splice(i, 1);
                    updateStorage();
                }
            });

        }
    });
});
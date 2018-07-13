// onload get the list of blocked URLs

let storageItems = {};

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
        chrome.storage.local.set({
            'urlBlockerData': {
                blocked: [abUrl]
            }
        }, function(items) {

            if (items) {
                console.log(items);
            }
            //window.location.reload();
        });
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
                    const parts = ['', blockedItems[i], 'Blocked', 'button'];
                    for (let i = 0; i < 4; i++) {
                        const td = document.createElement('td');
                        td.innerHTML = parts[i];
                        tr.appendChild(td);

                    }
                }
            }
        }
    });
});
// onload get the list of blocked URLs


const dataRowContent = `<td>{{parentURL}}</td><td>{{allowBlockURL}}</td><td>{{allowBlockText}}</td>`,
    buttonRowContent = `<td><button id="delete-button" data-id="{{dataID}}">Delete</button></td>`;

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
        // otherwise we just block this url always
        var tr = document.createElement('tr');
        table.tBodies[0].appendChild(tr);
        const parts = ['', abUrl, 'Blocked', 'button'];
        for (let i = 0; i < 4; i++) {
            const td = document.createElement('td');
            td.innerHTML = parts[i];
            tr.appendChild(td);
        }
    }
}

const addButton = document.getElementById('add-button');
addButton.addEventListener('click', handleAddClick, false);

document.addEventListener('DOMContentLoaded', restore_options => {
    const table = document.getElementById('display-results').tBodies[0];

    chrome.storage.sync.get('urlBlockerData', function(items) {
        
        if ( items ) { 
            console.log(items);
        }
        /*var tr = document.createElement('tr');
        table.appendChild(tr);
        const parts = ['', '', 'Blocked', 'button'];
        for (let i = 0; i < 4; i++) {
            const td = document.createElement('td');
            td.innerHTML = parts[i];
            tr.appendChild(td);
        }*/
    });
});
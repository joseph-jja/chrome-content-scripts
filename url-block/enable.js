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

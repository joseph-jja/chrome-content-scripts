const hostname = window.location.host;

//const workerPath = chrome.runtime.getURL('worker.js');
//const workerThread = new Worker(workerPath);

setTimeout(() => {

    const iframes = Array.from(document.querySelectorAll('iframe'));
    iframes.forEach(iframe => {
        iframe.style.display = 'none';
    });
}, 1000);

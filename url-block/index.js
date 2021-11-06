const hostname = window.location.host;

//const workerPath = chrome.runtime.getURL('worker.js');
//const workerThread = new Worker(workerPath);

let counts = 0;
const timerID = setInterval(() => {
    Array.from(document.querySelectorAll('iframe')).forEach(iframe => { 
        iframe.remove(); 
    });
    counts++;
    if (counts > 200) {
        clearInterval(timerID);
    }
    const ele = document.getElementById('IL_INSEARCH');
    if (ele) {
        ele.remove();
    }
    const allElements = Array.from(document.querySelectorAll('*'));
    allElements.forEach(ele => {
        if (ele.id && (ele.id.indexOf('ads') > -1) || ele.className.indexOf('ads') > -1) {
            ele.style.display = 'none';
        } else if (ele.id && (ele.id.indexOf('avert') > -1) || ele.className.indexOf('avert') > -1) {
            ele.style.display = 'none';
        }
    });    
}, 1000);

/*setTimeout(() => {

    const iframes = Array.from(document.querySelectorAll('iframe'));
    iframes.forEach(iframe => {
        iframe.style.display = 'none';
    });
    const allElements = Array.from(document.querySelectorAll('*'));
    allElements.forEach(x => {
        if (x.id && (x.id.indexOf('ads') > -1)) {
            x.style.display = 'none';
        } else if (x.className.indexOf('ads') > -1) {
            x.style.display = 'none';
        }
    });
}, 1000);*/

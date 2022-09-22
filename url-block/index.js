const hostname = window.location.host;

//const workerPath = chrome.runtime.getURL('worker.js');
//const workerThread = new Worker(workerPath);

function checkID(eleObj, value) {
    return (eleObj && eleObj.id && eleObj.id.indexOf(value) > -1);
}

function checkClass(eleObj, value) {
    return (eleObj.className && typeof eleObj.className === 'string' && eleObj.id.indexOf(value) > -1);
}

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
    allElements.forEach(eleObj => {
        if (checkID(eleObj, 'ads') || checkClass(eleObj, 'ads')) {
            eleObj.style.display = 'none';
        } else if (checkID(eleObj, 'avert') || checkClass(eleObj, 'avert')) {
            eleObj.style.display = 'none';
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

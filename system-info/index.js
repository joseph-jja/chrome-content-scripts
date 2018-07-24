
const containers = [ 'cpu', 'memory', 'storage', 'display' ],
    sizeNames = ['K', 'M', 'G', 'T'];

const NAME_LIST = {
    'name': 'Name',
    'availableCapacity': 'Free',
    'capacity': 'Total',
    'archName': 'Architecture Name',
    'modelName': 'Model',
    'numOfProcessors': 'Processor Count', 
    'type': 'Type'
};

const workerPath = chrome.runtime.getURL('timer.js');
//console.log(workerPath);
const workerThread = new Worker(workerPath);

function createContainer(name) {
    const container = document.getElementById('system-info');
    container.style.padding = '0.4em';
    
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.innerHTML = name;

    const childElement = document.createElement('div');
    childElement.id = name;
    childElement.style.margin = '0 0.4em';
    childElement.style.fontSize = '1.1em';
    childElement.style.width = '90%';
    childElement.style.overflowY = 'scroll';
    
    container.appendChild(fieldset);
    fieldset.appendChild(legend);
    fieldset.appendChild(childElement);
}

function formatNum(n, nSize) { 
    let nn = n, 
        ns = nSize;
    if (`${nn}`.length > 3) {
        nn = parseInt(nn/1000);
        if ( typeof ns === 'undefined' ) {
              ns = -1;  
        }
        ns++;
        return formatNum(nn, ns);
    }
    return `${nn}${(ns ? sizeNames[ns] : '')}`;
}

function iterateOverObject( obj ) {
  
    let result = '';
    
    const keys = Object.keys(obj);
    for ( let i = 0, end = keys.length; i<end; i++ ) {    
        const keyName = keys[i];
        let value = obj[keyName];
        if ( !Array.isArray( value )  && isFinite(value) ) {
            value = formatNum(value);
        }
        let idStr = ''
        if (keyName === 'processors' ) {
            idStr = ' id="' + keyName + '"';
        } else if ( keyName === 'temperatures' ) {
            idStr = ' id="' + keyName + '"';
            for ( let j = 0, jend = value.length; j<jend; j++ ) { 
                value[j] = Math.floor( ( value[j] * 1.8 ) + 32 );
            }
        }
        const displayName = ( NAME_LIST[keyName] ? NAME_LIST[keyName] : keyName );
result += `<div${idStr}>${displayName}: ${JSON.stringify(value)}</div>`;
    }
    return result;
}

let lastProcessorData

function manageWorker() {
    if ( !lastProcessorData ) { 
        const processors = document.getElementById('processors');
        const last = JSON.parse(processors.innerHTML.replace('processors: ', ''));
        lastProcessorData = last;
    }
    workerThread.postMessage({ 
        'callMeBack': 1000 
    });    
}

function calculatePercent(x, total) {
    let result = x;
    if ( total !== 0 ) {
        result =  Math.ceil( ( x / total ) * 100 );  
    }
    return result;
}

workerThread.onmessage = (e) => {
    chrome.system.cpu.getInfo( data => {
        const processors = document.getElementById('processors'), 
              temperatures = document.getElementById('temperatures');
        let results = [];
        for ( let i = 0, end = lastProcessorData.length; i<end; i++ ) {
            const idle = (data.processors[i].usage.idle - lastProcessorData[i].usage.idle),
                  total = (data.processors[i].usage.total - lastProcessorData[i].usage.total),
                  user = (data.processors[i].usage.user - lastProcessorData[i].usage.user),
                  kernel = (data.processors[i].usage.kernel - lastProcessorData[i].usage.kernel); 
            results.push({usage: {
                idle: Math.ceil(idle),
                total: total,
                user: Math.ceil(user),
                kernel: Math.ceil(kernel)
            }});
        }
        processors.innerHTML = 'processors: ' + JSON.stringify(results);
        lastProcessorData = data.processors;
        
        results = [];
        for ( let j = 0, jend = data.temperatures.length; j<jend; j++ ) { 
            results.push(Math.floor( ( data.temperatures[j] * 1.8 ) + 32 ));
        }
        temperatures.innerHTML = 'temperatures: ' + JSON.stringify(results);
        manageWorker();
    });
}

function updateDisplay(name, data) {
    const container = document.getElementById(name);
    
    let result = '';
    
    if ( Array.isArray(data) ) {
        for ( let i = 0, end = data.length; i<end; i++ ) { 
            let idName = i, 
                iterObj = data[i];
            if ( iterObj['name'] ) {
                idName = iterObj['name'];
                delete iterObj['name'];
            }
            result += `<div>${NAME_LIST['name']}: ${idName}<br><div style="padding-left:1em;">`;
            result += iterateOverObject(iterObj);
            result += '</div></div>';
        }
    } else {
        result = iterateOverObject(data);
    }
    
    container.innerHTML = result; 
}

function getStats() {
    containers.forEach( component => {

        chrome.system[component].getInfo( data => { 
            updateDisplay(component, data);
            if ( component === 'cpu' ) {
                manageWorker();
            }
        });
    });
}

window.onresize = function () {
    const mainComponent = document.getElementById('system-info');
    mainComponent.style.height = window.innerHeight - 50 + 'px';
};

window.onload = function () {
    const mainComponent = document.getElementById('system-info');
    mainComponent.style.height = window.innerHeight -50 + 'px';

    containers.forEach( name => {
        createContainer(name)
    });
    getStats();        
};

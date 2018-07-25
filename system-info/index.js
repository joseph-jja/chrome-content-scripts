const containers = ['cpu', 'memory', 'storage', 'display', 'network'],
    containerInfoMethod = ['getInfo', 'getInfo', 'getInfo', 'getInfo', 'getNetworkInterfaces'],
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

let lastProcessorData;

function manageWorker() {
    workerThread.postMessage({
        'callMeBack': 1000
    });
}

workerThread.onmessage = (e) => {
    chrome.system.cpu.getInfo(data => {
        const processors = document.getElementById('processors'),
            temperatures = document.getElementById('temperatures');
        let results = [];

        const originalData = JSON.stringify([].concat(data.processors));

        for (let i = 0, end = lastProcessorData.length; i < end; i++) {
            const idle = (data.processors[i].usage.idle - lastProcessorData[i].usage.idle),
                total = (data.processors[i].usage.total - lastProcessorData[i].usage.total),
                user = (data.processors[i].usage.user - lastProcessorData[i].usage.user),
                kernel = (data.processors[i].usage.kernel - lastProcessorData[i].usage.kernel);
            results.push({
                usage: {
                        idle: Math.ceil(calculatePercent(idle, total)),    
                        user: Math.ceil(calculatePercent(user, total)),    
                        kernel: Math.ceil(calculatePercent(kernel, total))      
                                    }
            });
        }
        processors.innerHTML = 'processors: ' + JSON.stringify(results);
        lastProcessorData = JSON.parse(originalData);

        results = [];
        for (let j = 0, jend = data.temperatures.length; j < jend; j++) {
            results.push(Math.floor((data.temperatures[j] * 1.8) + 32));
        }
        temperatures.innerHTML = 'temperatures: ' + JSON.stringify(results);
        manageWorker();
    });
}

function updateDisplay(name, data) {
    const container = document.getElementById(name);

    let result = '';

    if (Array.isArray(data)) {
        for (let i = 0, end = data.length; i < end; i++) {
            let idName = i,
                iterObj = data[i];
            if (iterObj['name']) {
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
    containers.forEach((component, index) => {

        methodCall = containerInfoMethod[index];
        chrome.system[component][methodCall](data => {
            const originalData = JSON.stringify([].concat(data.processors));
            updateDisplay(component, data);
            if (component === 'cpu') {
                lastProcessorData = JSON.parse(originalData);
                manageWorker();
            }
        });
    });
}

window.onresize = function() {
    const mainComponent = document.getElementById('system-info');
    mainComponent.style.height = window.innerHeight - 50 + 'px';
};

window.onload = function() {
    const mainComponent = document.getElementById('system-info');
    mainComponent.style.height = window.innerHeight - 50 + 'px';

    containers.forEach(name => {
        createContainer(name)
    });
    getStats();
};

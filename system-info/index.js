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
        
        const originalData = JSON.stringify([].concat(data.processors));

        let results = lastProcessorData.map( (lastUsage, i) => {
            const idle = (data.processors[i].usage.idle - lastUsage.usage.idle),
                total = (data.processors[i].usage.total - lastUsage.usage.total),
                user = (data.processors[i].usage.user - lastUsage.usage.user),
                kernel = (data.processors[i].usage.kernel - lastUsage.usage.kernel);
            return getUsage(user, kernel, total).usage;
        });
        
        processors.innerHTML = 'processors: ' + renderCPU(results);
        lastProcessorData = JSON.parse(originalData);

        results = JSON.stringify(mapTemperature(data.temperatures));   
        temperatures.innerHTML = `temperatures: ${results}`;
        manageWorker();
    });
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

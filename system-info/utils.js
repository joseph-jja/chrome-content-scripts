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

// we can approximate idle as it should be about the rest
function getUsage(user, kernel, total) {

    const userPct = calculatePercent(user, total),
        kernelPct = calculatePercent(kernel, total),
        idlePct = Number.parseFloat(100 - userPct - kernelPct).toFixed(1);

    return {
        usage: {
            idle: idlePct,
            user: userPct,
            kernel: kernelPct
        }
    };
}

function getDisplayName(keyName) {
    return (NAME_LIST[keyName] ? NAME_LIST[keyName] : keyName);   
}

function mapTemperature(value) {
    return value.map( val => {
        const temp = Math.floor((val * 1.8) + 32);
        return `${temp}F`;
    });
}

function renderCPU(data) {

    const header = '<thead><th>CPU</th><th>idle</th><th>user</th><th>system</th></thead>';
    
    const rows = data.map( (row, i) => {
        return `<tr><td>${i}</td><td>${row.idle}</td><td>${row.user}</td><td>${row.kernel}</td></tr>`; 
    });
    
    return `<table>${header}<tbody>${rows.join('')}</tbody></table><br>`;
    
}

function iterateOverObject(obj, formatter) {

    let result = '';

    const keys = Object.keys(obj);
    for (let i = 0, end = keys.length; i < end; i++) {
        const keyName = keys[i];
        
        let value = obj[keyName];
        // not an array and is just a number
        if (!Array.isArray(value) && isFinite(value)) {
            value = formatNum(value);
        }
        
        let idStr = '';
        if (formatter) {
            idStr = formatter(keyName, value);
            value = JSON.stringify(value);   
        } else if (keyName === 'processors') {
            idStr = ' id="' + keyName + '"';
            const rvalue = value.map( val => {
                const usage = val.usage;
                return getUsage(usage.user, usage.kernel, usage.total).usage;
            });
            value = renderCPU(rvalue);   
        } else if (keyName === 'temperatures') {
            idStr = ' id="' + keyName + '"';
            value = JSON.stringify(mapTemperature(value));   
        } else if ( value instanceof String || (typeof value).toLowerCase() === 'string' ) {
            // do nothing as the data is already a string
        } else {
            value = JSON.stringify(value);   
        }
        
        result += `<div${idStr}>${getDisplayName(keyName)}: ${value}</div>`;
    }
    return result;
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

function formatNum(n, nSize) {
    let nn = n,
        ns = nSize;
    if (`${nn}`.length > 3) {
        nn = parseInt(nn / 1000);
        if (typeof ns === 'undefined') {
            ns = -1;
        }
        ns++;
        return formatNum(nn, ns);
    }
    return `${nn}${(ns ? sizeNames[ns] : '')}`;
}

function calculatePercent(x, total) {
    let result = x;
    if (total !== 0) {
        result = Number.parseFloat((x / total) * 100).toFixed(1);
    }
    return result;
}

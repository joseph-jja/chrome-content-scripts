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

function iterateOverObject(obj, formatter) {

    let result = '';

    const keys = Object.keys(obj);
    for (let i = 0, end = keys.length; i < end; i++) {
        const keyName = keys[i];
        let value = obj[keyName];
        if (!Array.isArray(value) && isFinite(value)) {
            value = formatNum(value);
        }
        let idStr = '';
        if (formatter) {
            idStr = formatter(keyName, value);
        } else if (keyName === 'processors') {
            idStr = ' id="' + keyName + '"';
            for (let j = 0, jend = value.length; j < jend; j++) {
                const usage = value[j].usage;
                value[j] = getUsage(usage.user, usage.kernel, usage.total).usage;
            }
        } else if (keyName === 'temperatures') {
            idStr = ' id="' + keyName + '"';
            for (let j = 0, jend = value.length; j < jend; j++) {
                value[j] = Math.floor((value[j] * 1.8) + 32);
            }
        }
        const displayName = (NAME_LIST[keyName] ? NAME_LIST[keyName] : keyName);
        result += `<div${idStr}>${displayName}: ${JSON.stringify(value)}</div>`;
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

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
        }
        const displayName = (NAME_LIST[keyName] ? NAME_LIST[keyName] : keyName);
        result += `<div${idStr}>${displayName}: ${JSON.stringify(value)}</div>`;
    }
    return result;
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


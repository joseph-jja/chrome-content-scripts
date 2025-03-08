function sendCommand(command) {

    // TODO implement
    return 0;
}

function checkBooleanResponse(response) {
    return (+response === 0);
}

// :SCMM/DD/YY#
// :SLHH:MM:SS#
export function setDateTime() {
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const day = `${now.getDay()}`.padStart(2, 0);
    const year = `${now.getFullYear()}`.substring(2);

    const response = sendCommand(`:SC${month}/${day}/${year}#`);
    if (checkBooleanResponse(response)) {
        const hour = `${now.getHours()}`.padStart(2, 0);
        const minutes = `${now.getMinutes()}`.padStart(2, 0);
        const seconds = `${now.getSeconds()}`.padStart(2, 0);

        const response = sendCommand(`:SC${hour}/${minutes}/${seconds}#`);
        return checkBooleanResponse(response);
    }
    return false;
}


// :GC# -> MM/DD/YY#
// :Ga# -> HH:MM:SS# (12 hour format)
// :GL# -> HH:MM:SS# (24 hour format)
export function getDateAndTime(amPm = false) {

}

// :StsDD*MM#
// :SgDDD*MM#
export function setLatitudeLongitude(lat, long) {}
import {
    sendCommand
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';

// useful for commands that will return 0 on success and 1 on error
export async function daisyChainBooleanCommands(commands = []) {

    let i = 0, 
        end = commands.length;
    let success = true;
    let response = 'Success';
    while (i < end && success) {
        const cmd = commands[i];        
        const [err, result] = await PromiseWrapper(sendCommand(cmd));
        if (err) {
            success = false;
            response = err;
        } else if (result !== 0) {
            if (result.startsWith('Command response:')) {
                const msg = result.replace('Command response:', '').trim();
                if (+msg === 1) {
                    success = false;
                    response = `Error sending command, got: ${result}`;
                } else {
                    response += ' ' + msg?.trim()?.replace(/\#/g, '');
                }
            } else {
                success = false;
                response = `Error sending command, got: ${result}`;
            }
        }
        i++;
    }
    return response;
}

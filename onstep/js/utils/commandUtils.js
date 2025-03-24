import {
    sendCommand
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';

// useful for commands that will return 0 on success and 1 on error
export async function daisyChainBooleanCommands(commands = []) {

    let i = 0,
        end = commands.length;
    let success = true;
    const response = [];
    while (i < end && success) {
        const cmd = commands[i];
        const [err, result] = await PromiseWrapper(sendCommand(cmd));
        if (err) {
            success = false;
            response.push(err);
        } else {
            response.push(result);
        }
        i++;
    }
    return response;
}
import fs from 'node:fs/promises';
import process from 'node:process';

import {
    safeParse
} from '#server/utils/jsonUtils.js';

const NO_REPLY = 'Reply: [none]';

const basedir = process.cwd();

const COMMAND_FILE = `${basedir}/js/data/commands.json`;

export async function loadCommandDataFile() {

    const commandFile = await fs.readFile(COMMAND_FILE);
    const commands = safeParse(commandFile.toString());

    const commandsWithNoReply = Object.keys(commands).filter(key => {
        const item = commands[key];
        return (item.reply === NO_REPLY);
    });

    /*.map(key => {
        const item = commands[key];
        return item; 
    });
    console.log(commandsWithNoReply);*/
    return commandsWithNoReply;
}

loadCommandDataFile();
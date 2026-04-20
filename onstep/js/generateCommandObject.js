import fs from 'node:fs';
import readline from 'node:readline';
import process from 'node:process';

const basedir = process.cwd();

const instream = fs.createReadStream(`${basedir}/documentation/commands.txt`);

const rl = readline.createInterface({
    input: instream
});

const commandOptions = {};

const MATCH_COMMAND = /\:[A-Za-z0-9\/\:\*\$\.\+\-\!\,\/\?\[\]]*\#/g;

rl.on('line', line => {

    const parts = line.match(MATCH_COMMAND);
    //console.log(parts);
    if (!parts || parts.length > 2 || parts.length < 1) {
        return;
    }
    const middle = parts[0];
    const [description, reply] = line.split(middle);
    commandOptions[parts[0].trim()] = {
        description: description.trim(),
        reply: reply.trim()
    };
});

rl.on('close', () => {
    fs.writeFileSync(`${basedir}/js/data/commands.json`, JSON.stringify(commandOptions));
    console.log("Commands processed: ", Object.keys(commandOptions).length);
});
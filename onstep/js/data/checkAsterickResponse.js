const COMMANDS_WITH_ASTERIC_END_REPLY = [

];


const checkAsterickResponse = command => {
    const results = COMMANDS_WITH_ASTERIC_END_REPLY.find(item => {
        return command.startsWith(item);
    });
    return (results?.length > 0);
};

export default checkAsterickResponse;

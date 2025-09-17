
const COMMANDS_WITH_ZERO_OR_ONE_REPLY = [
  ':Te#',
  ':Td#',
  ':Tr#',
  ':Tn#',
  ':Lo',
  ':LW',
  ':$BR',
  ':$BD',
  ':WR',
  ':AW#',
  ':A1#',
  ':A+#',
  ':hQ#',
  ':hP#',
  ':hR#',
  ':FA#',
  ':fA#',
  ':FA',
  ':Fa#',
  ':FB',
  ':FC',
  ':Fc#',
  ':Fc',
  ':FD',
  ':FP',
  ':FS'
 ];


const checkZeroResponse = command => {
   const results = COMMANDS_WITH_ZERO_OR_ONE_REPLY.find(item => {
        return command.startsWith(item);
    });
    return (results?.length > 0);
};

export default checkZeroResponse;

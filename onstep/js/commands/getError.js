/* 
Response from #GE#
Code	Symbol	Meaning
00	CE_NONE	No error
01	CE_0	False/fail without a protocol error
02	CE_CMD_UNKNOWN	Unknown command
03	CE_REPLY_UNKNOWN	Invalid reply
04	CE_PARAM_RANGE	Parameter out of range
05	CE_PARAM_FORM	Bad parameter format
06	CE_ALIGN_FAIL	Align failed
07	CE_ALIGN_NOT_ACTIVE	Align not active
08	CE_NOT_PARKED_OR_AT_HOME	Not parked or at home
09	CE_PARKED	Already parked
10	CE_PARK_FAILED	Park failed
11	CE_NOT_PARKED	Not parked
12	CE_NO_PARK_POSITION_SET	No park position set
13	CE_GOTO_FAIL	Goto failed
14	CE_LIBRARY_FULL	Library full
15	CE_SLEW_ERR_BELOW_HORIZON	Target below horizon limit
16	CE_SLEW_ERR_ABOVE_OVERHEAD	Target above overhead limit
17	CE_SLEW_ERR_IN_STANDBY	Controller in standby
18	CE_SLEW_ERR_IN_PARK	Mount parked
19	CE_SLEW_IN_SLEW	Goto already active
20	CE_SLEW_ERR_OUTSIDE_LIMITS	Outside configured limits
21	CE_SLEW_ERR_HARDWARE_FAULT	Hardware fault
22	CE_SLEW_IN_MOTION	Mount already in motion
23	CE_SLEW_ERR_UNSPECIFIED	Other slew error
25	CE_1	Explicit true/success
*/
const COMMANDS_WITH_DECIMAL_REPLY = [
    ':GE#'
];

const checkCommandsWithDecimalReply = command => {
    const results = COMMANDS_WITH_DECIMAL_REPLY.find(item => {
        return command.startsWith(item);
    });
    return (results?.length > 0);
};

export default checkCommandsWithDecimalReply;
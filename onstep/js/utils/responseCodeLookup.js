
const ERRORCODE_LOOKUP_TABLE = {
    '00': {	code: 'CE_NONE', message: 'No error'},
    '01': {	code: 'CE_0', message: 'False/fail without a protocol error'},
    '02': {	code: 'CE_CMD_UNKNOWN', message: 'Unknown command'},
    '03': {	code: 'CE_REPLY_UNKNOWN', message: 'Invalid reply'},
    '04': {	code: 'CE_PARAM_RANGE', message: 'Parameter out of range'},
    '05': {	code: 'CE_PARAM_FORM', message: 'Bad parameter format'},
    '06': {	code: 'CE_ALIGN_FAIL', message: 'Align failed'},
    '07': {	code: 'CE_ALIGN_NOT_ACTIVE', message: 'Align not active'},
    '08'	: {	code: 'CE_NOT_PARKED_OR_AT_HOME', message: 'Not parked or at home'},
    '09'	: {	code: 'CE_PARKED', message: 'Already parked'},
    '10'	: {	code: 'CE_PARK_FAILED', message: 'Park failed'},
    '11'	: {	code: 'CE_NOT_PARKED', message: 'Not parked'},
    '12'	: {	code: 'CE_NO_PARK_POSITION_SET', message: 'No park position set'},
    '13'	: {	code: 'CE_GOTO_FAIL', message: 'Goto failed'},
    '14'	: {	code: 'CE_LIBRARY_FULL', message: 'Library full'},
    '15'	: {	code: 'CE_SLEW_ERR_BELOW_HORIZON', message: 'Target below horizon limit'},
    '16'	: {	code: 'CE_SLEW_ERR_ABOVE_OVERHEAD', message: 'Target above overhead limit'},
    '17'	: {	code: 'CE_SLEW_ERR_IN_STANDBY', message: 'Controller in standby'},
    '18'	: {	code: 'CE_SLEW_ERR_IN_PARK', message: 'Mount parked'},
    '19'	: {	code: 'CE_SLEW_IN_SLEW', message: 'Goto already active'},
    '20'	: {	code: 'CE_SLEW_ERR_OUTSIDE_LIMITS', message: 'Outside configured limits'},
    '21'	: {	code: 'CE_SLEW_ERR_HARDWARE_FAULT', message: 'Hardware fault'},
    '22'	: {	code: 'CE_SLEW_IN_MOTION', message: 'Mount already in motion'},
    '23'	: {	code: 'CE_SLEW_ERR_UNSPECIFIED', message: 'Other slew error'},
    '25'	: {	code: 'CE_1', message: 'Explicit true/success'}
};

const commandResponse = (code) => {

    const reply = {
        code
    }

    if (`${code}` === '1') {
        reply.symbol = 'CE_NONE';
        reply.message = 'Success';
    } else {
      const rc = ERRORCODE_LOOKUP_TABLE[`${code}`.padStart(2, '0')];
      const [symbol, message] = rc || {};
      reply.symbol = symbol;
        reply.message = message;
    }

    return reply; 
}

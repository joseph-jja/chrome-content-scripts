import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import CustomFieldset from 'js/components/base/CustomFieldset.jsx';
import {
    setupConnection,
    teardownConnection
} from 'js/api/request.js';
import StorageBox from "js/storage/StorageBox.js";
import {
    daisyChainBooleanCommands
} from 'js/utils/commandUtils.js';

const {
    useState,
    useEffect
} = React;

const HOST_PORT_RE = /\d+\.\d+\.\d+\.\d+\:\d*/;
const SERIAL_PORT_RE = /\/dev\//;

export default function Connection() {
    const [hostPort, setHostPort] = useState(StorageBox.getItem('hostPort'));
    const [serialPort, setSerialPort] = useState(StorageBox.getItem('serialPort'));
    const [serialOrHostPortError, setSerialOrHostPortError] = useState('');
    const [extraStartupCommands, setExtraStartupCommands] = useState([]);

    useEffect(() => {
        if (electron?.config?.device) {
            setSerialPort(electron?.config?.device);
        } else if (electron?.config?.hostPort) {
            setHostPort(electron?.config?.hostPort);
        }
    }, []);

    useEffect(() => {     
      if (electron?.config?.startUpCommands && Array.isArray(electron?.config?.startUpCommands)) {
          // TODO process startup commands
          const COMMAND_SYNTAX = /:[a-z|A-Z|0-9]*#/;
          const startupCommands = electron?.config?.startUpCommands.filter(command => {
              // filter out commands that are not valid
              if (!command?.command) {
                  return false;
              }
              if (!command.command.match(COMMAND_SYNTAX)) {
                  return false;
              }
              return true;
          }).map(commandObj => {              
              /* {
                    command: ':GVN#',
                    isBoolean: false,
                    hasResponse: true,
                    terminatorCharacter: '#'
                }
              */
              const {
                  command,
                  isBoolean = false,
                  hasResponse = false,
                  terminatorCharacter,
                  maxReadLength
              } = commandObj;
              const result = {
                  command,
                  isBoolean,
                  hasResponse
              };
              if (terminatorCharacter) {
                  result.terminatorCharacter = terminatorCharacter;
              }
              if (maxReadLength) {
                  result.maxReadLength = maxReadLength;
              }
              return result;
          });
          if (startupCommands.length > 0) {
              setExtraStartupCommands(startupCommands);
          }
      }
    }, []);

    const setSerialPortField = (event) => {
        setSerialPort(event?.target?.value);
    }
    const setHostPortField = (event) => {
        setHostPort(event?.target?.value);
    }

    const remoteConnect = (connectString) => {
        setupConnection(connectString).then(data => {
            setSerialOrHostPortError(data);
            const commandList = [{
                    command: ':GVP#',
                    isBoolean: false,
                    hasResponse: true,
                    terminatorCharacter: '#'
                },
                {
                    command: ':GVN#',
                    isBoolean: false,
                    hasResponse: true,
                    terminatorCharacter: '#'
                },
                {
                    command: ':GVD#',
                    isBoolean: false,
                    hasResponse: true,
                    terminatorCharacter: '#'
                },
                {
                    command: ':GVT#',
                    isBoolean: false,
                    hasResponse: true,
                    terminatorCharacter: '#'
                }
            ]
            if (extraStartupCommands.length > 0) {
                extraStartupCommands.forEach(item => {
                    commandList.push(item);
                });
            }
            daisyChainBooleanCommands(commandList).then(results => {

                const content = [data].concat(results);
                setSerialOrHostPortError(content);
            }).catch(err => {
                setSerialOrHostPortError(data + err);
            });
        }).catch(e => {
            setSerialOrHostPortError(e);
        });
    }

    const sendConnectCommand = () => {
        if (hostPort && hostPort.match(HOST_PORT_RE)) {
            setSerialOrHostPortError('');
            StorageBox.setItem('hostPort', hostPort);
            StorageBox.deleteItem('serialPort');
            // now we need to call fetch
            // and send to server
            remoteConnect(hostPort);
        } else if (serialPort && serialPort.match(SERIAL_PORT_RE)) {
            setSerialOrHostPortError('');
            StorageBox.setItem('serialPort', serialPort);
            StorageBox.deleteItem('hostPort');
            // now we need to call fetch
            // and send to server
            remoteConnect(serialPort);
        } else {
            setSerialOrHostPortError('Invalid host CustomFieldsetand port or COM / tty port entered!');
        }
    }

    const sendDisconnectCommand = () => {
        teardownConnection().then(data => {
            setSerialOrHostPortError(data);
        }).catch(e => {
            setSerialOrHostPortError(e);
        });
    }

    return (
        <CustomFieldset legendtext="Connection">
            <CustomInput type="text" labelText="Host:Port"
                    id="host-port" name="host_port" inputValue={hostPort} size="22"
                    placeholderText="xxx.xxx.xxx.xxx:yyyy"
                    onInputChange={setHostPortField}/>
            <br/>OR<br/>
            <CustomInput type="text" labelText="Serial Port"
                    id="serial-port" name="serial_port" inputValue={serialPort} size="22"
                    placeholderText="/dev/ttyxxxx"
                    onInputChange={setSerialPortField}/>
            <ErrorMessage>{serialOrHostPortError}</ErrorMessage>
            <br/>
            <CustomButton id="serial-connect" 
                onButtonClick={sendConnectCommand}>Connect</CustomButton>
            <CustomButton id="serial-disconnect" 
                onButtonClick={sendDisconnectCommand}>Disconnect</CustomButton>
        </CustomFieldset>
    );
}

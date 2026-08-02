### This is a nodejs app to communicate with onstep/onstepx devices. This works using both http when over wifi and /dev/ tty device when using usb.  It has not been tested with windows and should work on mac.  Useful when using firecapture or another software that does not talk to the mount.  


### To build and run this, follow these steps
* git clone this repo
* install nodejs if you do not have it installed already, nodejs 18 or later is better
* cd chrome-content-scripts/onstep/serialcom
  * serialcom is a node C library designed specifically for talking to onstep and understands the protocol
* npm ci
* npm run build
* cd .. (should be in chrome-content-scripts/onstep)
* npm ci
* npm run webpack
* npm run start

### First you connect to the system and then you can start sending some commands
* You can connect via WiFi using http://192.168.0.1:9999 or if you have configured different IP and use different port
* Or you can connect via /dev/ttyACM0 or other device, Mac uses different device and this is not tested on windoww

### You can also create a js/config.json file
* Values are exposed in electron.config
* ApplicationID and SecretID are used for an API that can help on the align screen
* Other fields include: latitude, longitude, offset (timezone offset), device, hostPort
* There is also a startUpCommands option that is an array of commands to run when the app starts
  - A single startup command requires at least an OnStep command starting with : and ending with the # and must be valid
  - If the command returns a value then hasResponse needs to be set to true
  - If the command only returns 0 or 1 then isBoolean should be set to true, else unset or false
  - If there is a different termination character in the response than # then terminatorCharacter should be set to that value
  - maxReadLength rarely needs to be set
* example
  ```
  {
      latitude: 60.50,
      longitude: 130.40,
      offset: 5,
      serialPort: '/dev/ttyUSB0',
      startUpCommands: [{
          command: ':GVT#',
          isBoolean: false,
          hasResponse: true,
          terminatorCharacter: '#'
      }, {
          command: ':GVD#',
          isBoolean: false,
          hasResponse: true,
          terminatorCharacter: '#',
          maxReadLength: 100
      }]
  }
  ```

### The align tab does not work yet, it is being worked out



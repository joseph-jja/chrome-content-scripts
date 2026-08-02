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

### The align tab does not work yet, it is being worked out



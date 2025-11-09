### This is a nodejs app to communicate with onstep/onstepx devices. This works using both http when over wifi and /dev/ tty device when using usb.  It has not been tested with windows and should work on mac.  Useful when using firecapture or another software that does not talk to the mount.  

### To build and run this, follow these steps
* git clone this repo
* install nodejs if you do not have it installed already, nodejs 18 or later is better
* npm ci
* npm run webpack
* npm run start

### First you connect to the system and then you can start sending some commands

### The align tab does not work yet, it is being worked out

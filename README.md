# Terminal-based P2P VoIP communication

## This is still a work in progress. It should basically work on Linux. I have not been able to fully test it yet, though.

- [x] Get a microphone input stream
- [x] Get a custom version of the `speaker` module which allows specifiying the output device. ([See here](https://github.com/T-vK/node-speaker/tree/select-audio-device))
- [x] Get a speaker output stream
- [x] Pipe a microphone input stream the the speaker output 
    - [x] On Ubuntu 16.04 LTS
    - [x] On Raspbian stretch
    - [x] On Fedora 26
- [x] Pipe a microphone input stream over the network into another node process and pipe it from there to a speaker 
- [ ] (Probably works; can't test yet) The above + the other way around (send+receive audio on both nodes at the same time)
   
## Description
tvoip is a simple terminal-based P2P VoIP application. Unlike Skype or similar applications:

 - tvoip is completely open source
 - does not require a server, an account or even the Internet in general
 - does not come with a GUI
 - and is completely controlled through your terminal/console

## Usage

```
  Usage: node index.js [options]


  Options:

    -V, --version                   output the version number
    -c, --connect <host:port>       Connect to a host, (Supports IP:port and hostname:port.)
    -l, --listen <port>             Automatically accept connections on this port.
    -i, --input [device-name]       Input device, (Leave empty to use the default recording device.)
    -o, --output [device-name]      Output device, (Leave empty to use the default playback device.)
    -a, --mic-channels <count>      Number of channels 1=mono; 2=stereo (Leave empty to use 1.)
    -b, --speaker-channels <count>  Number of channels 1=mono; 2=stereo (Leave empty to use 2.)
    -h, --help                      output usage information

  Examples:

    node index.js --listen 3333 --input hw:0,0 --output hw:1,1
    node index.js --connect 192.168.1.101:3333 --input hw:0,0 --output hw:1,1
    
```
(The format for the input/output device comes from ALSA. Please refer to `arecord` and `aplay` and this [stackoverflow question](https://superuser.com/questions/53957/what-do-alsa-devices-like-hw0-0-mean-how-do-i-figure-out-which-to-use).)


## Installation

### Dependencies (for the audio backend)

#### If you are on Linux:
You will need ALSA.  

 - Debian, Ubuntu, Raspbian etc.:
    The packages are usually called `libasound2-dev`, `alsa-base` and `alsa-utils` on debian-like systems (`sudo apt-get install libasound2-dev alsa-base alsa-utils`).  
 - Fedora and possibly other rpm based distros:
    You find them as `alsa-lib-devel` `alsa-utils` and `alsa-lib` (`sudo dnf install alsa-lib-devel alsa-utils alsa-lib`)
 - Other
    Please use your favourite search engine to find out and report back if you got it to work. :)

#### If you are on Mac OS X:
You will need SoX. Please go here: [SoX](https://sourceforge.net/projects/sox/files/sox/)

#### If you are on Windows:
You will need SoX. Please go here: [SoX](https://sourceforge.net/projects/sox/files/sox/)

### General dependencies 

 - First you need to install a recent version of [NodeJS](https://nodejs.org/en/download/). 
 - Secondly you need git. [You can get it here](https://git-scm.com/downloads)
 - Finally you need node-gyp (installation differs for Linux, OS X and Win). [Follow these steps.](https://github.com/nodejs/node-gyp)

### Actual installation of tvoip

 - From your terminal/command line:
    - Clone this repository recursively: `git clone --recursive https://github.com/T-vK/tvoip.git`
    - Enter the project's directory: `cd tvoip`
    - Install and compile the dependencies: `npm i`

### Questions, Feature requests, Pull Requests, Problems?

Please open an issue [right here](https://github.com/T-vK/tvoip/issues) on Github.

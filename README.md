# Terminal-based P2P VoIP communication

## This is a work-in-progress. It is not functional as of now.

## Description
tvoip is a simple terminal-based P2P VoIP application. Unlike Skype or similar applications:

 - tvoip is completely open source
 - does not require a server, an account or even the Internet in general
 - does not come with a GUI
 - and is completely controlled through your terminal/console

## Installation

### Dependencies

#### If you are on Linux:
You will need ALSA. The packages are usually called `libasound2-dev`, `alsa-base` and `alsa-utils`.  
If you'Re on Debian, Ubuntu or similar, a simple `sudo apt-get install libasound2-dev alsa-base alsa-utils` should do the job for you.

#### If you are on Mac OS X:
You will need SoX. Please go here: [SoX](https://sourceforge.net/projects/sox/files/sox/)

#### If you are on Windows:
You will need SoX. Please go here: [SoX](https://sourceforge.net/projects/sox/files/sox/)

### Actual Installation of tvoip

 - First you need to install a recent version of [NodeJS](https://nodejs.org/en/download/). 
 - Then you can run `npm i -g tvoip`.

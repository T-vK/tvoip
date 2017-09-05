var mic = require('mic-stream')
var speaker = require('audio-speaker')
 
mic().pipe(speaker())

process.stdin.resume()

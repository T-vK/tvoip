const net = require('net')
const mic = require('mic')
const Speaker = require('speaker')

const micInstance = mic({
    rate: '16000',
    channels: '1',
    debug: true,
    exitOnSilence: 6
})
const micInputStream = micInstance.getAudioStream()
const speakerInstance = new Speaker({
    channels: 2,          // 2 channels
    bitDepth: 16,         // 16-bit samples
    sampleRate: 44100     // 44,100 Hz sample rate
})
console.log('about to start')
micInputStream.pipe(speakerInstance)
console.log('started')

process.stdin.resume()

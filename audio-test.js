const mic = require('mic')
const Speaker = require('speaker')

const micInstance = mic({ // arecord -D hw:0,0 -f S16_LE -r 44100 -c 2
    device: 'hw:0,0',           //   -D hw:0,0
    encoding: 'signed-integer', //             -f S
    bitwidth: '16',             //                 16
    endian: 'little',           //                   _LE
    rate: '44100',              //                       -r 44100
    channels: '2',              //                                -c 2
    debug: true
    //exitOnSilence: 6
})
const micInputStream = micInstance.getAudioStream()

const speakerInstance = new Speaker({ // | aplay -D plughw:CARD=0,DEV=0
    channels: 2,
    bitDepth: 16,
    sampleRate: 44100,
    signed: true,
    device: 'plughw:NVidia,7'
})
speakerInstance.on('open', ()=>{
    console.log("Speaker received stuff")
})


micInputStream.pipe(speakerInstance)
micInputStream.on('data', data => {
    console.log("Recieved Input Stream: " + data.length)
})
micInputStream.on('error', err => {
    cosole.log("Error in Input Stream: " + err)
})
micInstance.start()

console.log('Started')

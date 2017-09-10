const program = require('commander')
const net = require('net')
const mic = require('mic')
const Speaker = require('speaker')
//const Speaker = require('./node-speaker')
const package = require('./package.json')

program
  .version(package.version)
  .option('-c, --connect <host:port>', 'Connect to a host, (Supports IP:port and hostname:port.)')
  .option('-l, --listen <port>', 'Automatically accept connections on this port.')
  .option('-i, --input [device-name]', 'Input device, (Leave empty to use the default recording device.)')
  .option('-o, --output [device-name]', 'Output device, (Leave empty to use the default playback device.)')
  .option('-a, --mic-channels <count>', 'Number of channels 1=mono; 2=stereo (Leave empty to use 1.)',1)
  .option('-b, --speaker-channels <count>', 'Number of channels 1=mono; 2=stereo (Leave empty to use 2.)',b=>parseInt(b),2)
  //.option('-s, --speaker-enabled', 'Speaker enabled initially. (true or false)', true)
  //.option('-m, --microphone-enabled', 'Microphone enabled initially. (true or false)', true)
  .parse(process.argv)

console.log('--connect: ' + program.connect)
console.log('--listen: ' + program.listen)
console.log('--input: ' + program.input)
console.log('--output: ' + program.output)

const mode = !program.connect ? 'listen' : 'connect'

let speakerConfig = { // | aplay -D plughw:NVidia,7
    //device: program.output, // -D plughw:NVidia,7
    channels: 2,
    bitDepth: 16,
    sampleRate: 44100,
    signed: true
}
if (program.output)
    speakerConfig.device = program.output
if (program['speaker-channels'])
    speakerConfig.channels = parseInt(program['speaker-channels'])

let micConfig = {       // arecord -D hw:0,0 -f S16_LE -r 44100 -c 2
    //device: program.input,    // -D hw:0,0
    encoding: 'signed-integer', //           -f S
    bitwidth: '16',             //               16
    endian: 'little',           //                 _LE
    rate: '44100',              //                     -r 44100
    channels: '2',              //                              -c 2
    debug: true
}
if (program.input)
    micConfig.device = program.input
if (program['mic-channels'])
    speakerConfig.channels = program['mic-channels']

const micInstance = mic(micConfig)
const micInputStream = micInstance.getAudioStream()
const speakerInstance = new Speaker(speakerConfig)

speakerInstance.on('open', ()=>{
    console.log("Speaker received stuff")
})

//micInputStream.on('data', data => {
//    console.log("Recieved Input Stream: " + data.length)
//})
micInputStream.on('error', err => {
    cosole.log("Error in Input Stream: " + err)
})

console.log('Mode: ' + mode)

if (mode === 'listen') {
    const server = net.createServer(socket=>{
    })
    server.on('error', err => {
        console.error(err)
    })
    server.on('connection', socket => {
        console.log('A client has connected.')
        socket.pipe(speakerInstance)
        micInputStream.pipe(socket) 
        micInstance.start()
    })
    server.listen(program.listen, ()=>{
        console.log('Server is listening')
    })
} else {
    const client = new net.Socket()
    client.connect({host: program.connect.split(':')[0], port: program.connect.split(':')[1]}, ()=>{
        console.log('Client connected')
        micInputStream.pipe(client)
        micInstance.start()
        client.pipe(speakerInstance)
    })
}

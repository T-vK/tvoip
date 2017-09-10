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
  .option('-a, --channels [count]', 'Number of channels 1=mono; 2=stereo (Leave empty to use 1.)',1)
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

//const micInstance = mic(micConfig)
//const micInputStream = micInstance.getAudioStream()
//const speakerInstance = new Speaker(speakerConfig)


console.log('Mode: ' + mode)

if (mode === 'listen') {
    const micInstance = mic(micConfig)
    const micInputStream = micInstance.getAudioStream()
    //const speakerInstance = new Speaker(speakerConfig)
    //speakerInstance.on('open', ()=>{
    //    console.log("Speaker received stuff")
    //})
    
    const server = net.createServer(socket=>{
        //micInputStream.pipe(socket) 
        //socket.pipe(speakerInstance)
    })
    server.on('error', err => {
        throw err
    })
    server.on('connection', socket => {
        console.log('A client has connected.')
        //socket.pipe(speakerInstance)
	micInputStream.pipe(socket)
        micInputStream.on('error', err => {
            cosole.log("Error in Input Stream: " + err)
        })
        micInstance.start()
    })
    server.listen(program.listen, ()=>{
        console.log('Server is listening')
    })
} else {
    const speakerInstance = new Speaker(speakerConfig)
    speakerInstance.on('open', ()=>{
        console.log("Speaker received stuff")
    })
    //const micInstance = mic(micConfig)
    //const micInputStream = micInstance.getAudioStream()
    
    const client = new net.Socket()
    client.connect({host: program.connect.split(':')[0], port: program.connect.split(':')[1]}, ()=>{
        console.log('Client connected')
        //micInputStream.pipe(client)
        //micInputStream.on('error', err => {
        //    cosole.log("Error in Input Stream: " + err)
        //})
        //micInstance.start()
	client.pipe(speakerInstance)
    })
}

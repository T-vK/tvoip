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
  .option('-d, --debug <bool>', 'true to enable debug, false to disable debug. (Leave empty to not use debug.)',d=>d==='true',false)
  .option('-g, --log <file>', 'Log to file')
  //.option('-s, --speaker-enabled', 'Speaker enabled initially. (true or false)', true)
  //.option('-m, --microphone-enabled', 'Microphone enabled initially. (true or false)', true)
  .parse(process.argv)

if (program.log) {
    const fs = require('fs')
    const util = require('util')
    const log_file = fs.createWriteStream(program.log, {flags : 'w'})
    const log_stdout = process.stdout
    const log_stderr = process.stderr

    console.log = function(d) {
        log_file.write(util.format(d) + '\n')
        log_stdout.write(util.format(d) + '\n')
    }

    console.error = function(d) {
        log_file.write(util.format(d) + '\n')
        log_stderr.write(util.format(d) + '\n')
    }
}

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
    debug: program.debug
}
if (program.input)
    micConfig.device = program.input
if (program['mic-channels'])
    speakerConfig.channels = program['mic-channels']

console.log('Mode: ' + mode)
console.log('\nSpeaker config')
console.log(speakerConfig)
console.log('\nMic config')
console.log(micConfig)

function setupTvoipStream(socket) {
    socket.on('error', error => {
        console.error("Socket error: " + error)
    })
    let micInstance = mic(micConfig)
    let micInputStream = micInstance.getAudioStream()
    //micInputStream.on('data', data => {
    //    console.log("Recieved Input Stream: " + data.length)
    //})
    micInputStream.on('error', err => {
        console.error("MIC-ERROR: Error in Input Stream: " + err)
    })
    //playStream(socket)
    //socket.pipe(speakerInstance)
    let speakerInstance = new Speaker(speakerConfig)
    speakerInstance.on('open', () => {
        console.log("Speaker event: open")
    })
    speakerInstance.on('flush', () => {
        console.log("Speaker event: flush")
    })
    speakerInstance.on('close', () => {
        console.log("Speaker event: close")
    })
    socket.pipe(speakerInstance)

    micInputStream.pipe(socket) 
    micInstance.start()
    socket.on('close', had_error => {
        micInstance.stop()
	micInputStream.destroy()
	micInputStream = undefined
        micInstance = undefined
        socket.destroy()
        speakerInstance.destroy()
        speakerInstance = undefined
    })
    socket.on('end', () => {
        speakerInstance.destroy()
    })
}


if (mode === 'listen') {
    console.log('--listen: ' + program.listen)
    const server = net.createServer()
    server.on('error', err => {
        console.error('Socket error: ' + err)
    })
    server.on('connection', socket => {
        console.log('A client has connected.')
        setupTvoipStream(socket)
    })
    server.listen(program.listen, () => {
        console.log('Server is listening')
    })
} else {
    const host = program.connect.split(':')[0]
    const port = program.connect.split(':')[1]
    console.log('Host: ' + host)
    console.log('Port: ' + port)

    function tvoipConnect(host, port) {
        const client = new net.Socket()
        client.on('close', () => {
            console.log('Server not reachable, next attempt in 4 seconds.')
	    setTimeout(() => {
                tvoipConnect(host, port)
	    }, 4000)
            //tvoipConnect(host, port)
        })
        client.on('error', err => {
            if(err.code == 'ECONNREFUSED') {
                //console.log('Closed, reconnect in 4s')
                //setTimeout(() => {
                //    tvoipConnect(host, port)
		//}, 4000)
            } else {
                console.error("Client socket error: " + err)
	    }
	})
        client.connect({host: host, port: port}, ()=>{
            console.log('Connected to server.')
            setupTvoipStream(client)
        })
    }
    
    tvoipConnect(host, port)
}

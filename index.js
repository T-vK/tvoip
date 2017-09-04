const program = require('commander')
const net = require('net')
const mic = require('mic')
const Speaker = require('speaker')
const package = require('./package.json')

program
  .version(package.version)
  .option('-c, --connect <hosts>', 'Connect to one or more hosts, (Comma-separated list of hosts. Supports IPs and hostnames.)', hosts=>hosts.split(','))
  .option('-l, --listen [hosts]', 'Automatically accept connection form these hosts. (Comma-separated list of hosts. Supports IPs and hostnames. Empty= Accept all connections)', hosts=>hosts.split(','), [])
  .option('-p, --port [port]', 'Default port to be used. (Empty= 80)', 80)
  //.option('-s, --speaker-enabled', 'Speaker enabled initially. (true or false)', true)
  //.option('-m, --microphone-enabled', 'Microphone enabled initially. (true or false)', true)
  .parse(process.argv)

console.log('Connect-hosts: ' + program.connect)
console.log('Listen-hosts: ' + program.listen)
console.log('Port: ' + program.port)

const mode = (typeof program.connect === undefined ? 'listen' : 'connect')

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


const server = net.createServer(socket=>{
    micInputStream.pipe(socket)
    socket.pipe(speakerInstance)
})

console.log('Mode: ' + mode)

if (mode === 'listen') {
    const server = net.createServer(socket=>{
        micInputStream.pipe(socket) 
        socket.pipe(speakerInstance)
    }) 
    server.listen(program.port, ()=>{
        console.log('Server: Connected')
    })
} else {
    const client = new net.Socket()
    client.connect(program.port, {host: program.hosts[0], port: program.port}, ()=>{
        console.log('Client: Connected')
        micInputStream.pipe(client)
        client.pipe(speakerInstance)
    })
}

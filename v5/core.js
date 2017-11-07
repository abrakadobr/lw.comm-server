const websockets = require('socket.io')
const config = require('./config')

const Comm = require('./comm')
const Utils = require('./utils')
var u = new Utils()


const Base = require('./base')

class Core extends Base {

  constructor(io,conf)
  {
    super(conf)
    var self=this
    self.io = io
    self.comm = new Comm()
    self.comm
    self.comm.on('ports:update',(ports)=>{
      io.sockets.emit('ports',ports)
    })
    self.comm.on('status',(data)=>{
      if (data.state == 'opening')
        self.io.sockets.emit('connectStatus', 'opening:' + data.path);

      if (data.state == 'opened')
      {
        self.io.sockets.emit('activePort', {port: data.path, baudrate: data.speed});
        self.io.sockets.emit('connectStatus', 'opened:' + data.path);
      }
      if (data.state == 'closed')
      {
        self.io.sockets.emit("connectStatus", 'closed:');
        self.io.sockets.emit("connectStatus", 'closed');
        self.io.sockets.emit('connectStatus', 'Connect');
      }
    })
    self.comm.on('machine',()=>{
      //machine detected
      self.machine = self.comm.machine
      self.io.sockets.emit('firmware', {
        firmware: self.machine.firmware,
        version: self.machine.fwVersion,
        date: self.machine.fwData
      });

    })
    this.reinit()
  }

  reinit()
  {
    var self=this
    self.connectionType = ''
    self.gcodeQueue = []
    self.machine = null

    self.lastSent = ''
    self.paused = false
    self.blocked = false
  }


  appConnected(sock)
  {
    var self=this

    sock.emit('serverConfig', config);
    sock.emit('interfaces', self.comm.getInterfaces());

    if(self.machine)
    {
    }

    sock.on('firstLoad', function () {
      //self.appFirstLoad()
    })
    // Deliver config of server (incl. versions)
    sock.on('getServerConfig', function () {
      sock.emit('serverConfig', config);
    })
    // Deliver supported Interfaces
    sock.on('getInterfaces', function () {
      sock.emit('interfaces', self.comm.getInterfaces());
    })
    // Refresh serial port list
    sock.on('getPorts', function () {
      sock.emit('ports', self.comm.usb.getPorts());
    })
    // Report active serial port to web-client
    sock.on('getConnectStatus', function () {
      if(self.machine)
      {
      }
    })
    // Deliver Firmware to Web-Client
    sock.on('getFirmware', function (data) {
      if(self.machine)
      {
      }
    })
    // Deliver supported Firmware Features to Web-Client
    sock.on('getFeatureList', function (data) {
      if(self.machine)
      {
      }
    })
    // Deliver running Job to Web-Client
    sock.on('getRunningJob', function (data) {
    })
    // If a user picks a port to connect to, open a Node SerialPort Instance to it
    sock.on('connectTo', function (data) {
      if(self.machine)
        return
      var connectPath = self.comm.connectMachine(data);
    })
    sock.on('runJob', function (data) {
    })
    sock.on('runCommand', function (data) {
    })
    sock.on('jog', function (data) {
    })
    // data = {x:xVal, y:yVal, z:zVal, mode:0(absulute)|1(relative), feed:fVal}
    sock.on('jogTo', function (data) {
    })
    sock.on('setZero', function (data) {
    })
    sock.on('gotoZero', function (data) {
    })
    sock.on('setPosition', function (data) {
    })
    sock.on('home', function (data) {
    })
    sock.on('probe', function (data) {
    })
    sock.on('feedOverride', function (data) {
    })
    sock.on('spindleOverride', function (data) {
    })
    // Laser Test Fire
    sock.on('laserTest', function (data) {
    })
    sock.on('pause', function () {
    })
    sock.on('resume', function () {
    })
    sock.on('stop', function () {
    })
    // Clear Alarm
    sock.on('clearAlarm', function (data) {
    })
    sock.on('resetMachine', function () {
    })
    // Close machine port and dump queue
    sock.on('closePort', function (data) {
      if(!self.machine)
        return
      self.io.sockets.emit("connectStatus", 'closing: usb');
      self.comm.disconnectMachine()
      self.machine = null
    })
    // App disconnected
    sock.on('disconnect', function () {
    })
  }


  run()
  {
    u.printHelloMessage()
  }
}

module.exports = Core

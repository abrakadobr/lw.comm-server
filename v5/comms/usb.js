const serialport = require('serialport');
var SerialPort = serialport;

const Base = require('./../base')

class Usb extends Base {

  constructor(conf)
  {
    super(conf)
    var self=this
    self.ports = []
    self.port = null
    setInterval(()=>{
      self.updatePorts()
    },2000)
  }

  getPorts()
  {
    return this.ports
  }

  updatePorts()
  {
    var self=this
    serialport.list(function (err, ports) {
      if (JSON.stringify(ports) != JSON.stringify(self.ports)) {
        self.ports = ports
        self.emit('ports:update', ports)
      }
    })
  }

  onPortOpen()
  {
    var self=this
    self.emit('port:open',{path: self.port.path, speed: self.port.options.baudRate})
  }

  onPortClose()
  {
    var self=this
    self.port = null
    self.emit('port:close')
  }

  onPortError(err)
  {
    var self=this
    self.emit('port:error',err)
  }

  onPortData(data)
  {
    var self=this
    self.emit('port:data',data)
  }

  connect(port,speed)
  {
    var self=this
    self.port = new SerialPort(port,{
      parser: serialport.parsers.readline('\n'),
      baudrate: parseInt(speed)
    })
    self.port.on('open',()=>{ self.onPortOpen(); })
    self.port.on('close',()=>{ self.onPortClose(); })
    self.port.on('error',(data)=>{ self.onPortError(data); })
    self.port.on('data',(data)=>{ self.onPortData(data); })
    return self.port
  }

  disconnect()
  {
    var self=this
    self.port.close()
    self.port = null
  }

  _write(msg)
  {
    var self=this
    if(!self.port)
      return
    self.port.write(msg)
  }

}

module.exports = Usb

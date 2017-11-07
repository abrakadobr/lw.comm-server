
const Base = require('./base')
const Usb = require('./comms/usb')
const GrblMachine = require('./machines/grbl')

class Comm extends Base {

  constructor(conf)
  {
    super(conf)
    var self=this
    self.machine = null
    self.port = null
    self.connectionType = null
    self.usb = new Usb()
    self.usb.on('ports:update',(ports)=>{
      self.emit('ports:update',ports)
    })
    self.usb.on('port:open',(info)=>{
      self.port = self.usb.port
      self.emit('status',{state: 'opened', path: info.path, speed: info.speed})
      setTimeout(()=>{
        //let's wait for 2sec. GRBL should detect automatically
        if (self.machine)
          return
        //  TODO
        //
        //  DETECT smoothie and others
        //
        //
      },2000)
    })

    self.usb.on('port:close',()=>{
      self.emit('port:close')
    })
    self.usb.on('port:error',(data)=>{
      self.emit('port:error',data)
    })
    self.usb.on('port:data',(data)=>{
      // here we only detect machine
      // real data parsing is implemented
      // in machines classes
      if (!self.machine)
      {
        self.detectMachine(data)
        return
      }
      self.emit('port:data',data)
    })
  }

  getInterfaces()
  {
    return ['USB']
  }

  getPorts()
  {
    return this.usb.getPorts()
  }

  connectMachine(str)
  {
    var self=this
    let data = str.split(',')
    let cType = data[0].toLowerCase()
    let cPath = ''
    if (cType == 'usb')
    {
      self.connectionType = 'usb'
      self.port = self.usb.connect(data[1],parseInt(data[2]))
      cPath = self.port.path
    }
    self.emit('status',{ state: 'opening', path: cPath })
    return self.port.path
  }

  detectMachine(data)
  {
    var self=this
    // Check if it's Grbl
    if (data.indexOf('Grbl') === 0)
    {
      self.machine = new GrblMachine(self.port)
      self.machine.init({helloMsg:data})
    }
    // Check if other machines
    //
    // .....
    //

    if (self.machine)
    {
      self.emit('machine')
    }
  }

  disconnectMachine()
  {
    var self=this
    if (self.connectionType == 'usb')
    {
      self.usb.disconnect()
      self.port = null
      self.machine = null
      self.emit('status',{state: 'closed'})
    }
  }

}

module.exports = Comm

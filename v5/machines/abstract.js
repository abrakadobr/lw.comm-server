const Base = require('./../base')

class AbstractMachine extends Base {

  constructor(port,conf)
  {
    super(conf)
    var self=this
    self.firmware = ''
    self.port = port
    self.fwVersion = ''
    self.fwDate = ''
    self.state = 'nothing'

    self.port.on('close',()=>{
      self.disconnect()
    })
  }

  disconnect()
  {
    var self=this
    self.port = null
    self.state = 'disconnected'
    self.emit('disconnected')
  }
}

module.exports = AbstractMachine

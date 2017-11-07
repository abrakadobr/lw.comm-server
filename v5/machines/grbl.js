const AbstractMachine = require('./abstract')

class GrblMachine extends AbstractMachine {

  constructor(conf)
  {
    super(conf)
    var self=this
    self.firmware = 'grbl'
    self.state = 'disconnected'
  }

  init(conf)
  {
    var self=this
    self.fwVersion = conf.helloMsg.substr(4,5).trim()
    self.state = 'connected'
  }

}

module.exports = GrblMachine

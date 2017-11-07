const EventEmitter = require('events')

class Base extends EventEmitter
{
  constructor(conf)
  {
    super()
    if(typeof conf == 'undefined')
      conf={}
    this.conf = this.$E(conf,{
      dbg: true,
    })
  }
  $E(a,b)
  {
    var ret = {}
    if(typeof(a)=='undefined' || a==null)
      a={}
    for (var i in a) ret[i] = a[i]
    for (var i in b) if ( typeof(a[i]) == 'undefined') ret[i] = b[i]
    return ret
  }
  dbg(val)
  {
    var self = this
    if(!self.conf.dbg)
      return
    console.log(val)
  }

}

module.exports = Base

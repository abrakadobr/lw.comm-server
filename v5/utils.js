
const os = require('os');
const fs = require('fs');
const chalk = require('chalk')
const config = require('./config')
const Base = require('./base')



class Utils extends Base {

  constructor(conf)
  {
    super(conf)
    var self=this
    self.logFile = null
  }

  printHelloMessage()
  {
    var self=this
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
      self.writeLog(chalk.green(' '), 0);
      self.writeLog(chalk.green('***************************************************************'), 0);
      self.writeLog(chalk.white('        ---- LaserWeb Comm Server ' + config.serverVersion + ' ----        '), 0);
      self.writeLog(chalk.green('***************************************************************'), 0);
      self.writeLog(chalk.white('  Use ') + chalk.yellow(' http://' + add + ':' + config.webPort) + chalk.white(' to connect this server.'), 0);
      self.writeLog(chalk.green('***************************************************************'));
      self.writeLog(chalk.green(' '), 0);
      self.writeLog(chalk.red('* Updates: '), 0);
      self.writeLog(chalk.green('  Remember to check the commit log on'), 0);
      self.writeLog(chalk.yellow('  https://github.com/LaserWeb/lw.comm-server/commits/master'), 0);
      self.writeLog(chalk.green('  regularly, to know about updates and fixes, and then when ready'), 0);
      self.writeLog(chalk.green('  update accordingly by running ') + chalk.cyan('git pull'), 0);
      self.writeLog(chalk.green(' '), 0);
      self.writeLog(chalk.red('* Support: '), 0);
      self.writeLog(chalk.green('  If you need help / support, come over to '), 0);
      self.writeLog(chalk.green('  ') + chalk.yellow('https://plus.google.com/communities/115879488566665599508'), 0);
      self.writeLog(chalk.green('***************************************************************'), 0);
      self.writeLog(chalk.green(' '), 0);
    });
  }




  isElectron()
  {
    if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer')
      return true;
    if (typeof process !== 'undefined' && process.versions && !!process.versions.electron)
      return true;
    return false;
  }

  writeLog(line, verb)
  {
    var self=this

    if (verb<=config.verboseLevel) {
        console.log(line);
    }
    if (config.logLevel>0 && verb<=config.logLevel) {
        if (!self.logFile) {
            if (self.isElectron() && os.platform == 'darwin') {
                //io.sockets.emit('data', 'Running on Darwin (macOS)');
                self.logFile = fs.createWriteStream(path.join(electronApp.getPath('userData'),'logfile.txt'));
            } else {
                self.logFile = fs.createWriteStream('./logfile.txt');
            }
            self.logFile.on('error', function(e) { console.error(e); });
        }
        var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        line = line.split(String.fromCharCode(0x1B) + '[31m').join('');
        line = line.split(String.fromCharCode(0x1B) + '[32m').join('');
        line = line.split(String.fromCharCode(0x1B) + '[33m').join('');
        line = line.split(String.fromCharCode(0x1B) + '[34m').join('');
        line = line.split(String.fromCharCode(0x1B) + '[35m').join('');
        line = line.split(String.fromCharCode(0x1B) + '[36m').join('');
        line = line.split(String.fromCharCode(0x1B) + '[37m').join('');
        line = line.split(String.fromCharCode(0x1B) + '[38m').join('');
        line = line.split(String.fromCharCode(0x1B) + '[39m').join('');
        line = line.split(String.fromCharCode(0x1B) + '[94m').join('');
        self.logFile.write(time + ' ' + line + '\r\n');
    }
  }



}


module.exports = Utils

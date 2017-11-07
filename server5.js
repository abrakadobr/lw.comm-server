const websockets = require('socket.io');
const http = require('http');
const nstatic = require('node-static');
const url = require('url');
const chalk = require('chalk');
const request = require('request'); // proxy for remote webcams
const config = require('./config')

const Core = require('./v5/core')

var webServer = new nstatic.Server('./app');
var app = http.createServer(function (req, res) {
    var queryData = url.parse(req.url, true).query;
    if (queryData.url) {
        if (queryData.url !== '') {
            request({
                url: queryData.url, // proxy for remote webcams
                callback: function (err, res, body) {
                    if (err) {
                        // writeLog(err)
                        console.error(chalk.red('ERROR:'), chalk.yellow(' Remote Webcam Proxy error: '), chalk.white('"' + queryData.url + '"'), chalk.yellow(' is not a valid URL: '));
                    }
                }
            }).on('error', function (e) {
                res.end(e);
            }).pipe(res);
        }
    } else {
        webServer.serve(req, res, function (err, result) {
            if (err) {
                console.error(chalk.red('ERROR:'), chalk.yellow(' webServer error:' + req.url + ' : '), err.message);
            }
        });
    }
});
app.listen(config.webPort);
var io = websockets.listen(app);

var core = new Core(io)

io.sockets.on('connection', function (appSocket) {
  core.appConnected(appSocket)
})

core.run()

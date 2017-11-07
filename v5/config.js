module.exports = {
  webPort: process.env.WEB_PORT || 8000,
  serverVersion: '5.0.1',
  apiVersion: '4.0.6',

  verboseLevel: process.env.VERBOSE_LEVEL || 1,
  logLevel: process.env.LOG_LEVEL || 0,
  resetOnConnect: process.env.RESET_ON_CONNECT || 0,

  posDecimals: process.env.DRO_DECIMALS || 2,
  firmwareWaitTime: process.env.FIRMWARE_WAIT_TIME || 10,
  grblWaitTime: process.env.GRBL_WAIT_TIME || 1,
  smoothieWaitTime: process.env.SMOOTHIE_WAIT_TIME || 1,
  tinygWaitTime: process.env.TINYG_WAIT_TIME || 1
}

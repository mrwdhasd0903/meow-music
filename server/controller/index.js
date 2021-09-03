const getDir = require("./getDir")
const getFile = require("./getFile")
const testTimeout = require("./testTimeout")

module.exports = {
  ...getDir,
  ...testTimeout,
  ...getFile
}
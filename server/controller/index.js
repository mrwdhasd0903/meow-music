const getDir = require("./getDir")
const getFile = require("./getFile")

module.exports = {
  ...getDir,
  ...getFile
}
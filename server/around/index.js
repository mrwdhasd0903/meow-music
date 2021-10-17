const fs = require('fs')
const { initDir } = require('../controller');
const { musicBasePath } = require("../config")

module.exports.createBefore = () => {
  return new Promise((resolve, reject) => {
    fs.exists(musicBasePath, (exists) => {
      if (exists) {
        initDir()
        resolve()
      } else {
        reject(`musicBasePath:${musicBasePath}不存在,请前往config文件配置`)
      }
    });
  })
} 
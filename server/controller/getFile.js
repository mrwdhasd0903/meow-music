const fs = require('fs');
const r_path = require('path');
const { musicBasePath } = require('../config');
module.exports = {
  '/getFile': (requset, response) => {
    const { query } = requset.parseUrl;
    // 音乐文件的相对路径
    const { path } = query;
    // 获取拓展名,用于Content-Type
    const extname = r_path.extname(path).replace('.', '');
    if (!path) {
      response.sendJSON({ msg: '缺少path参数' });
    } else {
      const fullPath = musicBasePath + path;
      const exists = fs.existsSync(fullPath);
      if (exists) {
        const stat = fs.lstatSync(fullPath);
        if (stat.isFile) {
          fs.readFile(fullPath, (err, data) => {
            if (err) {
              response.sendJSON({ msg: '文件无法读取' });
            } else {
              response.setHeader('Content-Type', 'audio/' + extname);
              setTimeout(() => {
                response.end(data);
              }, 2000);
            }
          });
        } else {
          response.sendJSON({ msg: '该路径非文件' });
        }
      } else {
        response.sendJSON({ msg: '路径不存在' });
      }
    }
  },
};

const fs = require('fs');
const r_path = require('path')
const { musicBasePath } = require("../config")
module.exports = {
  '/getFile': (requset, response) => {
    const { query } = requset.parseUrl;
    const { path } = query;
    const extname = r_path.extname(path).replace(".", "")
    if (!path) {
      response.end('404');
    } else {
      const fullPath = musicBasePath + path;
      const exists = fs.existsSync(fullPath);
      if (exists) {
        const stat = fs.lstatSync(fullPath);
        if (stat.isFile) {
          fs.readFile(fullPath, (err, data) => {
            if (err) {
              response.end('404');
            } else {
              response.setHeader('Content-Type', 'audio/' + extname);
              setTimeout(() => {
                response.end(data);
              }, 2000)
            }
          });
        } else {
          response.end('contine');
        }
      } else {
        response.end('404');
      }
    }
  }
}
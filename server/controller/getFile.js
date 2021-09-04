const fs = require('fs');
const url = require('url');
const r_path = require('path')
const basePath = `E:/ljj/`;
module.exports = {
  '/getFile': (requset, response) => {
    const { query } = url.parse(requset.url, true);
    const { path } = query;
    const extname = r_path.extname(path).replace(".", "")
    if (!path) {
      response.end('404');
    } else {
      const fullPath = basePath + path;
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
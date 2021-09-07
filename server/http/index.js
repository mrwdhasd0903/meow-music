const http = require('http');
const url = require('url');

let server = null;

module.exports = {
  // 重写createServer
  createServer(callback) {
    server = http.createServer((requset, response) => {
      // 增强requset
      const parseUrl = url.parse(requset.url, true);
      requset.parseUrl = parseUrl;
      // 增强response
      const sendJSON = (string) => response.end(JSON.stringify(string));
      response.sendJSON = sendJSON;
      callback(requset, response);
    });
  },
  run(port, tip) {
    if (server == null) {
      console.log('请先使用http.createServer创建服务');
    } else if (!port) {
      console.log('请传入http.run的第一个参数端口');
    } else {
      const listen = server.listen(port);
      listen.on('listening', () => {
        console.log(tip);
      });
      listen.on('error', (err) => {
        const code = err.code;
        if (code === 'EADDRINUSE') {
          console.log(`错误：端口 ${port} 被占用，code：${code}`);
        }
      });
    }
  },
};

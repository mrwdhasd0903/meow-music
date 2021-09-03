const http = require('./http');
const { resHeaders } = require("./config")
const filter = require("./filter/request")
const controller = require('./controller/index.js');
http.createServer((requset, response) => {
  Object.keys(resHeaders).forEach(key => {
    response.setHeader(key, resHeaders[key]);
  })
  filter(requset, response)
  if (requset.do) {
    const { pathname } = requset.parseUrl
    controller[pathname](requset, response)
  }
})
http.run(7777)

console.log('服务启动了~');

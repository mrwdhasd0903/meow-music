const http = require('./http');
const { resHeaders, port } = require("./config")
const filter = require("./filter/request")
const controller = require('./controller');
const { createBefore } = require("./around")

createBefore().then(_ => {
  http.createServer((requset, response) => {
    Object.keys(resHeaders).forEach(key => {
      response.setHeader(key, resHeaders[key]);
    })
    filter(requset, response)
    if (requset.do) {
      const { pathname } = requset.parseUrl
      const fn = controller[pathname]
      if (fn) {
        fn(requset, response)
      }
    }
  })
  http.run(port, '服务启动了~')
}).catch(err => {
  console.log(err)
})

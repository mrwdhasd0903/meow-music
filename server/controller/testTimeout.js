module.exports = {
  '/testTimeout': (requset, response) => {
    setTimeout(() => {
      response.end(JSON.stringify({ aaa: 'asdasd' }));
    }, 2000)
  }
}
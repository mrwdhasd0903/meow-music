const fs = require('fs');
const basePath = `E:/ljj/`;
const MIN_SIZE = 1024 * 1024;
const dirContainer = {};

function recursive(fullPath) {
  const dirs = fs.readdirSync(fullPath);
  for (let i = 0; i < dirs.length; i++) {
    const name = dirs[i];
    const currPath = fullPath + name;
    const stat = fs.lstatSync(currPath);
    const isFile = stat.isFile();

    /**
     * 处理dirContainer
     */
    const patchPath = fullPath.replace(basePath, '');
    const pathArr = patchPath.split('/');
    pathArr.pop();
    if (isFile) {
      if (stat.size > MIN_SIZE) {
        setDirContainer(pathArr, name, true);
      } else {
        // console.log('跳过');
      }
    } else {
      setDirContainer(pathArr, name, {});
      recursive(currPath + '/');
    }
  }
}

function setDirContainer(pathArr, key, value) {
  let _dirContainer = dirContainer;
  pathArr.forEach((key, index) => {
    _dirContainer = _dirContainer[key];
    if (!_dirContainer) {
      _dirContainer = {};
    }
  });
  _dirContainer[key] = value;
}
module.exports = {
  "/getDir": (requset, response) => {
    recursive(basePath);
    response.sendJSON(dirContainer);
  }
}
const fs = require('fs');
const { musicBasePath } = require("../config")
const MIN_SIZE = 1024 * 1024;
// 具有目录结构的对象,用于存放返回的数据
const dirContainer = {};

/**
 * 递归目录
 * @param {绝对路径} fullPath 
 */
function recursive(fullPath) {
  // 读取目录
  const dirs = fs.readdirSync(fullPath);
  // 循环子路径
  for (let i = 0; i < dirs.length; i++) {
    const name = dirs[i];
    // 子路径绝对路径
    const currPath = fullPath + name;
    // 判断是否文件
    const stat = fs.lstatSync(currPath);
    const isFile = stat.isFile();

    /**
     * 处理dirContainer
     */
    // 相对路径 - 即去掉基础路径
    const patchPath = fullPath.replace(musicBasePath, '');
    const pathArr = patchPath.split('/');
    pathArr.pop();
    if (isFile) {
      if (stat.size > MIN_SIZE) {
        // 设置到dirContainer中 - 大小过滤
        setDirContainer(pathArr, name, true);
      } else {
        // console.log('跳过');
      }
    } else {
      // 设置到dirContainer中
      setDirContainer(pathArr, name, {});
      // 递归
      recursive(currPath + '/');
    }
  }
}

/**
 * 
 * @param {相对路径 - 以数组表示} pathArr 
 * @param {目录\文件名,用于做key值} key 
 * @param {存放的值,如果是目录则存放空对象,如果是文件则存放true} value 
 */
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
    recursive(musicBasePath);
    response.sendJSON(dirContainer);
  }
}
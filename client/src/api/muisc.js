import req from '@/fetch';

export const getDir = () => req.get('getDir');

export const getFile = (path, controller) =>
  req
    .get('getFile', { path }, { responseType: 'blob', controller, timeout: 60000 })
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      return new Promise((resolve, reject) => {
        resolve(window.URL.createObjectURL(blob));
      });
    })
    .catch((err) => {
      console.log(err);
      console.log('中断了请求');
    });

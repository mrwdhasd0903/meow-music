const defaultConfig = {
  baseUrl: "http://localhost:7777/",
  timeout: 12000,
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  }
}
const promiseWithOptions = function (options, interceptor) {
  const { headers, timeout, url, query, method, data } = options
  // 组装 query
  let queryString = ""
  if (query && typeof query === "object") {
    const keys = Object.keys(query)
    if (keys.length) {
      queryString += "?"
      keys.forEach(key => {
        queryString += `${key}=${query[key]}&`
      })
      queryString = queryString.slice(0, queryString.length - 1)
    }
  }
  // 用于超时结束请求
  const controller = new AbortController();
  const { signal } = controller;
  // 超时promise
  const timeoutPromise = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      controller.abort();
      reject(`请求超时,设置的时间:${timeout}`);
    }, timeout)
  })
  // 请求promise
  const requestPromise = () => new Promise((resolve, reject) => {
    fetch(url + queryString, {
      method,
      data,
      headers: new Headers(headers),
      signal
    }).then(res => {
      res.json().then(data => {
        res.data = data
        resolve(res)
      })
    }, err => reject(err))
  })
  // race
  return Promise.race([timeoutPromise(), requestPromise()])
}
/**
 * @param {Object} options
 * @param {Object} config
 * 将options与config整合
 */
const optionsWithConfig = function (options, config) {
  options.headers = { ...config.headers, ...options.headers }
  options.timeout = options.timeout || config.timeout;
  return options
}

const req = {
  config: defaultConfig,
  interceptor: {
    request: (config) => {
      // return false  // 拦截请求
      return config
    },
    response: (response, config) => {
      return response
    }
  },
  request(options = {}) {
    options = optionsWithConfig(options, this.config)
    options.url = this.config.baseUrl + options.url
    let { method } = options
    if (!method) {
      method = "GET"
    }
    options.method = method
    return promiseWithOptions(options, this.interceptor)
  },
  get(url, p_query, options = {}) {
    options = optionsWithConfig(options, this.config)
    // get 请求的query 参数从形参p_query 和 options 中的query拿到
    let { query } = options
    query = { ...p_query, ...query }
    options.url = this.config.baseUrl + url;
    options.query = query;
    options.method = 'GET';
    return promiseWithOptions(options, this.interceptor)
  },
  post(url, data, options = {}) {
    options = optionsWithConfig(options, this.config)
    options.url = this.config.baseUrl + url;
    options.data = data;
    options.method = 'POST';
    return promiseWithOptions(options, this.interceptor);
  },
}

export default req

import { readFileSync, readdirSync } from 'fs'

let idPerfix = ''
const svgTitle = /<svg([^>+].*?)>/
const clearHeightWidth = /(width|height)="([^>+].*?)"/g
const hasViewBox = /(viewBox="[^>+].*?")/g
const clearReturn = /(\r)|(\n)/g

// 查找svg文件
function svgFind(e) {
  const arr = []
  const dirents = readdirSync(e, { withFileTypes: true })
  for (const dirent of dirents) {
    if (dirent.isDirectory()) arr.push(...svgFind(e + dirent.name + '/'))
    else if (dirent.name.split(".")[1] === 'svg') {
      const svg = readFileSync(e + dirent.name)
        .toString()
        .replace(clearReturn, '')
        .replace(svgTitle, ($1, $2) => {
          let width = 0,
            height = 0,
            content = $2.replace(clearHeightWidth, (s1, s2, s3) => {
              if (s2 === 'width') width = s3
              else if (s2 === 'height') height = s3
              return ''
            })
          if (!hasViewBox.test($2)) content += `viewBox="0 0 ${width} ${height}"`
          return `<symbol id="${idPerfix}_${dirent.name.replace('.svg', '')}" ${content}>`
        }).replace('</svg>', '</symbol>')
      arr.push(svg)
    }
  }
  return arr
}

// 生成svg
export const createSvg = (path: any, perfix = 'icon') => {
  if (path === '') return
  idPerfix = perfix
  const res = svgFind(path)
  return {
    name: 'svg_transform',
    transformIndexHtml(dom: String) {
      return dom.replace(
        '<body>',
        `<body><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0">${res.join('')}</svg>`
      )
    }
  }
}
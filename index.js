const path = require('path')
const buble = require('@qubit/buble')
const less = require('less')

module.exports = {
  process: function process (src, filename) {
    switch (path.extname(filename)) {
      case '.js':
        return transformJs(src)
      case '.css':
      case '.less':
        return transformCss(src)
      default:
        return src
    }
  }
}

function transformJs (src) {
  return buble.transform(src, {
    transforms: {
      dangerousForOf: true,
      dangerousTaggedTemplateString: true
    },
    objectAssign: 'Object.assign'
  }).code
}

function transformCss (src) {
  let code
  less.render(src, { sync: true }, (_, result) => {
    code = result.css
  })
  code = `module.exports = require('@qubit/add-stylesheet')(
    ${JSON.stringify(code)}
  )`
  return code
}

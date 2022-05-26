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
        return transformCss(src, filename)
      default:
        return src
    }
  }
}

function transformJs (src) {
  return buble.transform(src, {
    transforms: {
      asyncAwait: false,
      dangerousForOf: true,
      dangerousTaggedTemplateString: true
    },
    objectAssign: 'Object.assign'
  }).code
}

function transformCss (src, filename) {
  let code
  less.render(src, { filename }, (_, result) => {
    code = result.css
  })
  code = `module.exports = require('@qubit/add-stylesheet')(
    ${JSON.stringify(code)}
  )`
  return code
}

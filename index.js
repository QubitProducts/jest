const buble = require('@qubit/buble')

module.exports = {
  process: function process (src) {
    return buble.transform(src, {
      transforms: {
        dangerousForOf: true,
        dangerousTaggedTemplateString: true
      },
      objectAssign: 'Object.assign'
    }).code
  }
}

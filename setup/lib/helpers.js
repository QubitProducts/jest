const path = require('path')
const { readFileSync } = require('fs')
const { render } = require('less')
const poller = require('@qubit/poller')

module.exports = {
  getRoot,
  getCss,
  getJson,
  createPoller,
  getCookieDomain
}

function getRoot (module) {
  return module ? path.dirname(module.filename) : process.cwd()
}

function getCss (path) {
  try {
    const rawCss = String(readFileSync(path))
    return lessRenderSync(rawCss)
  } catch (err) {}
}

function lessRenderSync (input) {
  let css
  render(input, { sync: true }, (err, result) => {
    if (err) throw err
    css = result.css
  })
  return css
}

function createPoller (logger) {
  return function poll (targets, options) {
    if (typeof options !== 'function') {
      options = Object.assign(
        {
          logger,
          stopOnError: true
        },
        options
      )
    }
    return poller(targets, options)
  }
}

function getJson (module, filename) {
  const root = getRoot(module)
  try {
    return require(path.join(root, filename))
  } catch (err) {
    return {}
  }
}

function getCookieDomain (domains, currentHost) {
  currentHost = currentHost || window.location.hostname

  var match = domains.find(function (domain) {
    var rDomain = regexify(domain)
    return rDomain.test(currentHost)
  })
  return match
}

function regexify (domain) {
  return new RegExp(
    '(^|\\.)' + removeLeadingDot(domain).replace(/\./g, '\\.') + '$'
  )
}

function removeLeadingDot (domain) {
  return domain.replace(/^\./, '')
}

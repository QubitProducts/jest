const path = require('path')
const { readFileSync } = require('fs')
const { render } = require('less')
const poller = require('@qubit/poller')

module.exports = {
  getRoot: memo(getRoot),
  getCss: memo(getCss),
  getJson: memo(getJson),
  createPoller,
  getCookieDomain
}

function getRoot (filename) {
  return filename ? path.dirname(filename) : process.cwd()
}

function getCss (path) {
  try {
    const rawCss = String(readFileSync(path))
    return lessRenderSync(rawCss)
  } catch (err) {}
}

function getJson (path) {
  try {
    return require(path)
  } catch (err) {
    return {}
  }
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

function memo (fn) {
  const cache = new Map()
  return (...args) => {
    const [key] = args
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = fn(...args)
    return result
  }
}

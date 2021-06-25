/* globals jest */
/* istanbul ignore file */
const Promise = require('sync-p/extra')
const poller = require('@qubit/poller')
const getBrowserState = require('@qubit/jolt/lib/getBrowserState')
const path = require('path')

module.exports = function setup (overrides) {
  const log = {
    trace: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }
  const cleanups = []
  const packageJson = getJson('package.json')
  const content = getJson('payload.json')
  const {
    placementId,
    trackingId,
    namespace,
    vertical,
    domains = [window.location.hostname],
    visitorId = 'visitorId',
    isPreview = false
  } = packageJson.meta || {}

  return {
    api: {
      elements: [],
      content,
      onRemove: cleanup => cleanups.push(cleanup),
      onImpression: jest.fn(),
      onClickthrough: jest.fn(),
      getBrowserState: jest.fn(() => Promise.resolve(getBrowserState())),
      getVisitorState: jest.fn(),
      log,
      meta: {
        cookieDomain: getCookieDomain(domains),
        isPreview,
        namespace,
        placementId,
        trackingId,
        vertical,
        visitorId
      },
      poll: createPoller(log),
      uv: {
        emit: jest.fn(),
        events: [],
        on: jest.fn(),
        once: jest.fn(),
        onceEventSent: jest.fn(),
        onEventSent: jest.fn()
      },
      ...overrides
    },
    teardown: () => {
      while (cleanups.length) cleanups.pop()()
    }
  }
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

function getJson (filename) {
  try {
    return require(path.join(process.cwd(), filename))
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

/* istanbul ignore file */
const { jest } = require('@jest/globals')
const Promise = require('sync-p/extra')
const getBrowserState = require('@qubit/jolt/lib/getBrowserState')
const addStylesheet = require('@qubit/add-stylesheet')
const path = require('path')
const {
  createPoller,
  getCss,
  getCookieDomain,
  getJson,
  getRoot
} = require('./lib/helpers')

module.exports = function setup (overrides, module) {
  const filename = module && module.filename
  const root = getRoot(filename)
  let css
  try {
    const lessFilePath = path.join(root, 'placement.less')
    css = getCss(lessFilePath)
  } catch (err) {}
  const log = {
    trace: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }
  const styles = addStylesheet(css || '')
  const cleanups = [styles.remove]
  const packageJson = getJson(path.join(root, 'package.json'))
  const content = getJson(path.join(root, 'payload.json'))
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
      styles,
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

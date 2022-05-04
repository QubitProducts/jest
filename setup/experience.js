/* globals jest */
/* istanbul ignore file */
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
  const log = {
    trace: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }
  const packageJson = getJson(module, 'package.json')
  const {
    experienceId,
    iterationId,
    variationId,
    variationMasterId,
    variationIsControl,
    trackingId,
    namespace,
    vertical,
    domains = [window.location.hostname],
    visitorId = 'visitorId',
    isPreview = false,
    templateData,
    solutionOptions
  } = packageJson.meta || {}

  let css
  try {
    if (module) {
      css = getVariationCss(module, variationMasterId)
    }
  } catch (err) {}

  const cleanups = [addStylesheet(css).remove]
  return {
    api: {
      data: templateData,
      onRemove: cleanup => cleanups.push(cleanup),
      getBrowserState: jest.fn(() => Promise.resolve(getBrowserState())),
      getVisitorState: jest.fn(),
      log,
      meta: {
        cookieDomain: getCookieDomain(domains),
        isPreview,
        namespace,
        trackingId,
        vertical,
        visitorId,
        experienceId,
        iterationId,
        variationId,
        variationMasterId,
        variationIsControl
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
      redirectTo: jest.fn(),
      emitCustomGoal: jest.fn(),
      emitMetric: jest.fn(),
      solution: solutionOptions,
      state: {
        get: jest.fn(),
        set: jest.fn()
      },
      cookies: {
        get: jest.fn(),
        getAll: jest.fn(),
        set: jest.fn(),
        clear: jest.fn(),
        clearAll: jest.fn()
      },
      react: {
        register: jest.fn(),
        getReact: jest.fn(),
        render: jest.fn(),
        release: jest.fn()
      },
      isMemberOf: jest.fn(),
      getMemberships: jest.fn(),
      onMembershipsChanged: jest.fn(),
      registerContentAreas: jest.fn(),
      unregisterContentAreas: jest.fn(),
      onActivation: jest.fn(),
      integration: {
        execute: jest.fn(),
        schedule: jest.fn(),
        cancel: jest.fn()
      },
      ...overrides
    },
    teardown: () => {
      while (cleanups.length) cleanups.pop()()
    }
  }
}

function getVariationCss (module, variationMasterId) {
  const paths = []

  if (variationMasterId) {
    const root = getRoot(module)
    paths.push(path.join(root, `variation-${variationMasterId}.less`))
  }

  if (module && /variation-\d+/.test(module.filename)) {
    paths.push(module.filename.replace(/(\.test)?\.js/, '.less'))
  }

  for (const filePath of paths) {
    const css = getCss(filePath)
    if (css) {
      return css
    }
  }

  return ''
}

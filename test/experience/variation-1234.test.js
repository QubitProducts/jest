const { it, expect, beforeEach, afterEach, describe } = require('@jest/globals')
const variation = require('./variation-1234')
const setup = require('../../setup/experience')

describe('variation-1234.js', () => {
  let api, teardown

  beforeEach(() => {
    ;({ api, teardown } = setup({}, module))
  })

  afterEach(() => {
    teardown()
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  it('resolves', () => {
    return variation(api).then(returnValue => {
      expect(returnValue).toEqual(true)
    })
  })

  it('applies the css', () => {
    variation(api)
    expect(window.getComputedStyle(document.body).background).toEqual('black')
  })
})

const triggers = require('./triggers')
const setup = require('../../setup')
const { it, expect, beforeEach, afterEach, describe } = require('@jest/globals')

describe('triggers.js', () => {
  let api, teardown

  beforeEach(() => {
    ;({ api, teardown } = setup({}, module))
  })

  afterEach(() => {
    teardown()
  })

  it('resolves', () => {
    return triggers(api).then(returnValue => {
      expect(returnValue).toEqual(true)
    })
  })
})

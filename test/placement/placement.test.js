const { it, expect, beforeEach, afterEach, describe } = require('@jest/globals')
const renderPlacement = require('./placement')
const setup = require('../../setup/placement')

describe('placement.js', () => {
  let content, api, teardown

  beforeEach(() => {
    ;({ api, teardown } = setup({ elements: [createHero()] }, module))
  })

  afterEach(() => {
    teardown()
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  describe('with content', () => {
    beforeEach(() => {
      content = {
        image: 'http://img.test/img.png',
        message: 'hello'
      }
    })

    it('updates the banner image', () => {
      renderPlacement({ ...api, content })

      expect(document.querySelector('.hero').style.backgroundImage).toEqual(
        expect.stringContaining(content.image)
      )
    })

    it('renders the message', () => {
      renderPlacement({ ...api, content })

      expect(document.querySelector('.hero').innerHTML).toEqual(
        expect.stringContaining(content.message)
      )

      expect(window.getComputedStyle(document.body).background).toEqual('black')
    })

    it('calls onImpression', () => {
      renderPlacement({ ...api, content })

      expect(api.onImpression.mock.calls.length).toBe(1)
    })

    it('calls onClickthrough', () => {
      renderPlacement({ ...api, content })

      document.querySelector('.hero a').click()
      expect(api.onClickthrough.mock.calls.length).toBe(1)
    })

    it('cleans up after itself', () => {
      renderPlacement({ ...api, content })

      const el = document.querySelector('.hero').parentElement
      expect(el.parentElement).toBeDefined()
      expect(api.elements[0].parentElement).toBeNull()
      teardown()
      expect(el.parentElement).toBeNull()
      expect(api.elements[0].parentElement).toBeDefined()
    })
  })

  describe('with null content', () => {
    beforeEach(() => {
      content = null
    })

    it('calls onImpression', () => {
      renderPlacement({ ...api, content })

      expect(api.onImpression.mock.calls.length).toBe(1)
    })

    it('calls onClickthrough', () => {
      renderPlacement({ ...api, content })

      document.querySelector('.hero a').click()
      expect(api.onClickthrough.mock.calls.length).toBe(1)
    })
  })
})

function createHero () {
  const el = document.createElement('div')
  el.className = 'hero'
  el.innerHTML = `<a/>`
  document.body.append(el)
  return el
}

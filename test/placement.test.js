const renderPlacement = require('./placement')

afterEach(() => (document.body.innerHTML = ''))

describe('with content', () => {
  const content = {
    image: 'http://img.test/img.png',
    message: 'hello'
  }
  test('updates the banner image', () => {
    const heroEl = createHero()
    const { api, teardown } = setup({
      elements: [heroEl],
      content
    })
    renderPlacement(api)

    expect(document.querySelector('.hero').style.backgroundImage).toEqual(
      expect.stringContaining(api.content.image)
    )
    teardown()
  })

  test('renders the message', () => {
    const heroEl = createHero()
    const { api, teardown } = setup({
      elements: [heroEl],
      content
    })
    renderPlacement(api)

    expect(document.querySelector('.hero').innerHTML).toEqual(
      expect.stringContaining(api.content.message)
    )
    teardown()
  })

  test('calls onImpression', () => {
    const heroEl = createHero()
    const { api, teardown } = setup({
      elements: [heroEl],
      content
    })
    renderPlacement(api)

    expect(api.onImpression.mock.calls.length).toBe(1)
    teardown()
  })

  test('calls onClickthrough', () => {
    const heroEl = createHero()
    const { api, teardown } = setup({
      elements: [heroEl],
      content
    })
    renderPlacement(api)

    const el = document.querySelector('.hero a')
    el.click()
    expect(api.onClickthrough.mock.calls.length).toBe(1)
    teardown()
  })

  test('cleans up after itself', () => {
    const heroEl = createHero()
    const { api, teardown } = setup({
      elements: [heroEl],
      content
    })
    renderPlacement(api)

    const el = document.querySelector('.hero').parentElement
    expect(el.parentElement).toBeDefined()
    expect(heroEl.parentElement).toBeNull()
    teardown()
    expect(el.parentElement).toBeNull()
    expect(heroEl.parentElement).toBeDefined()
  })
})

describe('with null content', () => {
  const content = null

  test('calls onImpression', () => {
    const heroEl = createHero()
    const { api, teardown } = setup({
      elements: [heroEl],
      content
    })
    renderPlacement(api)

    const el = document.querySelector('.hero')
    expect(api.onImpression.mock.calls.length).toBe(1)
    teardown()
  })

  test('calls onClickthrough', () => {
    const heroEl = createHero()
    const { api, teardown } = setup({
      elements: [heroEl],
      content
    })
    renderPlacement(api)

    const el = document.querySelector('.hero a')
    el.click()
    expect(api.onClickthrough.mock.calls.length).toBe(1)
    teardown()
  })
})

function createHero () {
  const heroEl = document.createElement('div')
  heroEl.className = 'hero'
  heroEl.innerHTML = `<a/>`
  document.body.append(heroEl)
  return heroEl
}

function setup (overrides) {
  const cleanups = []
  return {
    api: {
      elements: [],
      content: null,
      onRemove: cleanup => cleanups.push(cleanup),
      onImpression: jest.fn(),
      onClickthrough: jest.fn(),
      ...overrides
    },
    teardown: () => {
      while (cleanups.length) cleanups.pop()()
    }
  }
}

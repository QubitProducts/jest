module.exports = function setup (overrides) {
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

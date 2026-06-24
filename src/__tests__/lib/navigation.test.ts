describe('NAV_ITEMS', () => {
  const originalEnv = process.env.NEXT_PUBLIC_EXPERIENCES_ENABLED

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_EXPERIENCES_ENABLED
    } else {
      process.env.NEXT_PUBLIC_EXPERIENCES_ENABLED = originalEnv
    }
  })

  describe('with experiences disabled', () => {
    let NAV_ITEMS: typeof import('@/lib/navigation').NAV_ITEMS

    beforeAll(() => {
      delete process.env.NEXT_PUBLIC_EXPERIENCES_ENABLED
      jest.isolateModules(() => {
        NAV_ITEMS = require('@/lib/navigation').NAV_ITEMS
      })
    })

    it('has 5 items', () => {
      expect(NAV_ITEMS).toHaveLength(5)
    })

    it('omits experiences', () => {
      expect(NAV_ITEMS.map((item) => item.key)).toEqual(['aboutMe', 'projects', 'talks', 'education', 'contact'])
    })

    it('has sequential indices starting from 1', () => {
      expect(NAV_ITEMS.map((item) => item.index)).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('with experiences enabled', () => {
    let NAV_ITEMS: typeof import('@/lib/navigation').NAV_ITEMS

    beforeAll(() => {
      process.env.NEXT_PUBLIC_EXPERIENCES_ENABLED = 'true'
      jest.isolateModules(() => {
        NAV_ITEMS = require('@/lib/navigation').NAV_ITEMS
      })
    })

    it('has 6 items', () => {
      expect(NAV_ITEMS).toHaveLength(6)
    })

    it('includes experiences in original order', () => {
      expect(NAV_ITEMS.map((item) => item.key)).toEqual(['aboutMe', 'projects', 'talks', 'experiences', 'education', 'contact'])
    })

    it('has sequential indices starting from 1', () => {
      expect(NAV_ITEMS.map((item) => item.index)).toEqual([1, 2, 3, 4, 5, 6])
    })
  })
})

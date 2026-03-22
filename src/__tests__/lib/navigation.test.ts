import { NAV_ITEMS } from '@/lib/navigation'

describe('NAV_ITEMS', () => {
  it('has 4 items', () => {
    expect(NAV_ITEMS).toHaveLength(4)
  })

  it('has correct translation keys', () => {
    expect(NAV_ITEMS.map((item) => item.key)).toEqual(['aboutMe', 'experiences', 'education', 'contact'])
  })

  it('has sequential indices starting from 1', () => {
    expect(NAV_ITEMS.map((item) => item.index)).toEqual([1, 2, 3, 4])
  })
})

import { renderHook, waitFor } from '@testing-library/react'

import { DIFF_THRESHOLD, useTimer } from './useTimer'

describe('useTimer', () => {
  const diffTresholdMs = DIFF_THRESHOLD * 1000

  it('Should display date format', async () => {
    const bigDate = new Date(Date.now() + diffTresholdMs * 2)
    const { result, unmount } = renderHook(() => useTimer(bigDate))
    await waitFor(
      () => {
        expect(result.current[0]?.includes('at')).toBe(true)
        expect(result.current[1] === 'date').toBe(true)
      },
      {
        timeout: 5_000,
      }
    )

    unmount()
  })

  it('Should display countdown format', async () => {
    const bigDate = new Date(Date.now() + (diffTresholdMs - 1000))
    const { result, unmount } = renderHook(() => useTimer(bigDate))
    await waitFor(
      () => {
        expect(result.current[0]?.includes('at')).toBe(false)
        expect(result.current[1] === 'countdown').toBe(true)
      },
      {
        timeout: 5_000,
      }
    )

    unmount()
  })

  it('Should convert into date type after reaching zero', async () => {
    const bigDate = new Date(Date.now() + 3000)
    const { result, unmount } = renderHook(() => useTimer(bigDate))

    expect(result.current[1] === 'countdown').toBe(true)
    await waitFor(
      () => {
        expect(result.current[1] === 'date').toBe(true)
      },
      {
        timeout: 10_000,
      }
    )
    unmount()
  })
})

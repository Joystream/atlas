import { act, renderHook } from '@testing-library/react'

import { DIFF_THRESHOLD, useTimer } from './useTimer'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('useTimer', () => {
  const diffTresholdMs = DIFF_THRESHOLD * 1000

  it('Should display date format', async () => {
    const bigDate = new Date(Date.now() + diffTresholdMs * 2)
    const { result, unmount } = renderHook(() => useTimer(bigDate))
    await sleep(1000)
    expect(result.current[0]?.includes('at')).toBe(true)
    expect(result.current[1] === 'date').toBe(true)
    unmount()
  })

  it('Should display countdown format', async () => {
    const bigDate = new Date(Date.now() + (diffTresholdMs - 1000))
    const { result, unmount } = renderHook(() => useTimer(bigDate))
    await act(async () => {
      await sleep(2000)
    })
    expect(result.current[0]?.includes('at')).toBe(false)
    expect(result.current[1] === 'countdown').toBe(true)
    unmount()
  })

  it('Should convert into date type after reaching zero', async () => {
    const bigDate = new Date(Date.now() + 1000 * 2)
    const { result, unmount } = renderHook(() => useTimer(bigDate))
    await act(async () => {
      await sleep(1000)
    })
    expect(result.current[1] === 'countdown').toBe(true)
    await act(async () => {
      await sleep(2000)
    })
    expect(result.current[1] === 'date').toBe(true)
    unmount()
  })
})

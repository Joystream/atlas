import { useCallback, useRef } from 'react'

const MILESTONES = [0.25, 0.5, 0.75, 0.9, null] as const

export const useVideoPortion = (
  videoDurationSeconds: number,
  milestoneCallback: (milestone: NonNullable<typeof MILESTONES[number]>) => void
) => {
  const currentWatchtime = useRef(0)
  const nextMilestone = useRef<typeof MILESTONES[number]>(0.25)
  const lastTickTime = useRef(performance.now())

  const registerVideoTick = useCallback(
    (tickIntervalMs: number, playbackRate: number) => {
      const now = performance.now()
      const performanceCheck = now - lastTickTime.current
      lastTickTime.current = now
      // ignore ticks that are not within 30% of ideal tick
      if (performanceCheck > tickIntervalMs * 1.3 || tickIntervalMs * 0.7 > performanceCheck) {
        return
      }
      currentWatchtime.current += tickIntervalMs * playbackRate
      const currentPortion = currentWatchtime.current / (videoDurationSeconds * 1_000)
      if (nextMilestone.current && currentPortion >= nextMilestone.current) {
        milestoneCallback(nextMilestone.current)
        nextMilestone.current =
          MILESTONES[Math.min(MILESTONES.length - 1, MILESTONES.indexOf(nextMilestone.current) + 1)]
      }
    },
    [milestoneCallback, videoDurationSeconds]
  )

  const clearTimer = useCallback(() => {
    currentWatchtime.current = 0
  }, [])

  return {
    registerVideoTick,
    clearTimer,
  }
}

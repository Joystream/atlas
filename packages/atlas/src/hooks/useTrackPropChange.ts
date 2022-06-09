import { useEffect, useRef } from 'react'

// useful to track what props are causing a component to rerender
export const useTrackPropsChange = (props: Record<string, unknown>) => {
  const prev = useRef(props)
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps: Record<string, unknown>, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v]
      }
      return ps
    }, {})
    if (Object.keys(changedProps).length > 0) {
      // eslint-disable-next-line no-console
      console.log('Changed props:', changedProps)
    }
    prev.current = props
  })
}

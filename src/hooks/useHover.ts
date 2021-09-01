import { useEffect, useRef, useState } from 'react'

// Note: changing the ref to a different element after initialization will cause the hook to not work
export const useHover = <T extends HTMLElement>() => {
  const [value, setValue] = useState(false)

  const ref = useRef<T>(null)

  const handleMouseOver = () => setValue(true)
  const handleMouseOut = () => setValue(false)

  useEffect(() => {
    const node = ref.current
    if (node) {
      node.addEventListener('mouseover', handleMouseOver)
      node.addEventListener('mouseout', handleMouseOut)

      return () => {
        node.removeEventListener('mouseover', handleMouseOver)
        node.removeEventListener('mouseout', handleMouseOut)
      }
    }
  }, [])

  return [ref, value] as const
}

import { useEffect, useState } from 'react'

export default function useScrollPosition(scrollFactor = 1) {
  const [position, setPosition] = useState(0)

  const onScroll = () => {
    setPosition(window.scrollY)
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return position * scrollFactor
}

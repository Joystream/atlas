import { useEffect, useState } from 'react'

export const useCheckBrowser = () => {
  const [browser, setBrowser] = useState<'chrome' | 'firefox' | null>(null)

  const checkBrowser = () => {
    if (navigator.userAgent.includes('Chrome')) {
      return 'chrome'
    }
    if (navigator.userAgent.includes('Firefox')) {
      return 'firefox'
    }
    return null
  }

  useEffect(() => {
    const checkedBrowser = checkBrowser()
    setBrowser(checkedBrowser)
  }, [])

  return browser
}

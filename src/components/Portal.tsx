import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

const Portal: React.FC = ({ children }) => {
  const el = React.useRef(document.createElement('div'))

  useEffect(() => {
    const element = el.current
    const portalRoot = document.getElementById('portal-root') as HTMLElement

    console.log(portalRoot)
    portalRoot.appendChild(element)
    return () => {
      portalRoot.removeChild(element)
    }
  }, [])

  return createPortal(children, el.current)
}

export default Portal

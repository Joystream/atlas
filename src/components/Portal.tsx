import React from 'react'
import { createPortal } from 'react-dom'

type PortalProps = {
  containerRef: React.RefObject<HTMLDivElement>
}

const Portal: React.FC<PortalProps> = ({ children, containerRef }) => {
  const element = containerRef.current
  if (!element) {
    return null
  }
  return createPortal(children, element)
}

export default Portal

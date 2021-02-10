import React from 'react'
import { createPortal } from 'react-dom'

type PortalProps = {
  portal: React.RefObject<HTMLDivElement>
}

const Portal: React.FC<PortalProps> = ({ children, portal }) => {
  const element = portal.current!
  return createPortal(children, element)
}

export default Portal

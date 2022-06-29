import { FC, PropsWithChildren, RefObject } from 'react'
import { createPortal } from 'react-dom'

type PortalProps = PropsWithChildren<{
  containerRef: RefObject<HTMLDivElement>
}>

export const Portal: FC<PortalProps> = ({ children, containerRef }) => {
  const element = containerRef.current
  if (!element) {
    return null
  }
  return createPortal(children, element)
}

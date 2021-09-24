import { Placement, offset } from '@popperjs/core'
import React, { RefObject, useRef, useState } from 'react'
import { usePopper } from 'react-popper'

import { Portal } from '@/components/Portal'
import { useOverlayManager } from '@/providers/overlayManager'

export type PopoverBaseProps = {
  targetRef: RefObject<HTMLElement>
  isVisible?: boolean
  placement?: Placement
  offset?: typeof offset
  className?: string
}

export const PopoverBase: React.FC<PopoverBaseProps> = ({
  targetRef,
  placement = 'bottom-start',
  children,
  className,
}) => {
  const { contextContainerRef } = useOverlayManager()
  const popperRef = useRef(null)
  const [arrowRef, setArrowRed] = useState<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(targetRef.current, popperRef.current, {
    placement,
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowRef,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  })

  return (
    <Portal containerRef={contextContainerRef}>
      <div ref={popperRef} style={styles.popper} {...attributes.popper} className={className}>
        <div ref={setArrowRed} style={styles.arrow} className="arrow" />
        {children}
      </div>
    </Portal>
  )
}

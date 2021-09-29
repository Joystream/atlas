import styled from '@emotion/styled'
import { Placement } from '@popperjs/core'
import Tippy from '@tippyjs/react/headless'
import React from 'react'

import { transitions } from '@/shared/theme'

export type PopoverBaseProps = {
  content: React.ReactNode
  isVisible?: boolean
  placement?: Placement
  offset?: [number, number]
  hideOnClick?: boolean
  className?: string
}

export const PopoverBase: React.FC<PopoverBaseProps> = ({
  hideOnClick = true,
  placement = 'bottom-start',
  children,
  offset = [0, 8],
  content,
  className,
}) => {
  return (
    <Tippy
      trigger="click"
      hideOnClick={hideOnClick}
      interactive
      animation
      onTrigger={(instance) => {
        const box = instance.popper.firstElementChild
        requestAnimationFrame(() => {
          box?.classList.add('popover-enter-active')
          box?.classList.remove('popover-exit-active')
        })
      }}
      onUntrigger={(instance) => {
        const box = instance.popper.firstElementChild
        requestAnimationFrame(() => {
          box?.classList.remove('popover-enter-active')
          box?.classList.add('popover-exit-active')

          setTimeout(() => instance.unmount(), 50)
        })
      }}
      render={(attrs) => (
        <ContentContainer {...attrs} className={className}>
          {content}
        </ContentContainer>
      )}
      placement={placement}
      offset={offset}
    >
      <TriggerContainer tabIndex={0}>{children}</TriggerContainer>
    </Tippy>
  )
}

const TriggerContainer = styled.div`
  height: max-content;
  width: max-content;
`

const ContentContainer = styled.div`
  transition: ${transitions.timings.sharp} cubic-bezier(0.25, 0.01, 0.25, 1);
  opacity: 0;
  transform: scale(0.88);

  &.popover-enter-active {
    opacity: 1;
    transform: scale(1);
  }

  &.popover-exit-active {
    opacity: 0;
    transform: scale(0.88);
    transition: 50ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }
`

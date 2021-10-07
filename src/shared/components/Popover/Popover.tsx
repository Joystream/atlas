import styled from '@emotion/styled'
import { Placement } from '@popperjs/core'
import Tippy, { TippyProps } from '@tippyjs/react/headless'
import React, { MutableRefObject } from 'react'

export type TippyInstance = Parameters<Required<TippyProps>['render']>[2] // what a mess, i know

export type PopoverProps = {
  content: React.ReactNode
  placement?: Placement
  offset?: [number, number]
  instanceRef?: MutableRefObject<TippyInstance>
  hideOnClick?: boolean
  className?: string
}

const EXIT_ANIMATION_DURATION = 100

export const Popover: React.FC<PopoverProps> = ({
  hideOnClick = true,
  placement = 'bottom-start',
  children,
  offset = [0, 8],
  content,
  instanceRef,
  className,
}) => {
  return (
    <Tippy
      trigger="click"
      hideOnClick={hideOnClick}
      interactive
      animation
      onCreate={(instance) => {
        if (instanceRef) {
          instanceRef.current = instance
        }
      }}
      onTrigger={(instance) => {
        const box = instance.popper.firstElementChild
        requestAnimationFrame(() => {
          box?.classList.add('popover-enter-active')
          box?.classList.remove('popover-exit-active')
        })
      }}
      onHide={(instance) => {
        const box = instance.popper.firstElementChild
        requestAnimationFrame(() => {
          box?.classList.remove('popover-enter-active')
          box?.classList.add('popover-exit-active')

          setTimeout(() => instance.unmount(), EXIT_ANIMATION_DURATION)
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
  transition: 150ms cubic-bezier(0.25, 0.01, 0.25, 1);
  opacity: 0;
  transform: scale(0.88);

  &.popover-enter-active {
    opacity: 1;
    transform: scale(1);
  }

  &.popover-exit-active {
    opacity: 0;
    transform: scale(0.88);
    transition: ${EXIT_ANIMATION_DURATION}ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }
`

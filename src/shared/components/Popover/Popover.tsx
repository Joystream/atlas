import styled from '@emotion/styled'
import { Placement } from '@popperjs/core'
import Tippy from '@tippyjs/react/headless'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Instance } from 'tippy.js'

export type PopoverImperativeHandle = {
  hide: () => void
}

export type PopoverProps = {
  trigger: React.ReactNode
  placement?: Placement
  offset?: [number, number]
  hideOnClick?: boolean
  className?: string
  onHide?(): void
  children?: React.ReactNode
}

const EXIT_ANIMATION_DURATION = 100

const _Popover: React.ForwardRefRenderFunction<PopoverImperativeHandle, PopoverProps> = (
  { hideOnClick = true, onHide, placement = 'bottom-start', children, offset = [0, 8], trigger, className },
  ref
) => {
  const tippyRef = useRef<Instance>()

  useImperativeHandle(ref, () => ({
    hide: () => tippyRef.current?.hide(),
  }))

  return (
    <Tippy
      trigger="click"
      hideOnClick={hideOnClick}
      interactive
      animation
      onCreate={(instance) => {
        tippyRef.current = instance
      }}
      onTrigger={(instance) => {
        const box = instance.popper.firstElementChild
        requestAnimationFrame(() => {
          box?.classList.add('popover-enter-active')
          box?.classList.remove('popover-exit-active')
        })
      }}
      onHide={(instance) => {
        const box = instance.popper?.firstElementChild
        requestAnimationFrame(() => {
          box?.classList.remove('popover-enter-active')
          box?.classList.add('popover-exit-active')

          setTimeout(() => {
            instance.unmount()
            onHide?.()
          }, EXIT_ANIMATION_DURATION)
        })
      }}
      render={(attrs) => (
        <ContentContainer {...attrs} className={className}>
          {children}
        </ContentContainer>
      )}
      placement={placement}
      offset={offset}
    >
      <TriggerContainer tabIndex={0}>{trigger}</TriggerContainer>
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

export const Popover = forwardRef(_Popover)
Popover.displayName = 'Popover'

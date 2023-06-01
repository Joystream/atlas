import styled from '@emotion/styled'
import { Boundary, Padding, Placement } from '@popperjs/core'
import Tippy from '@tippyjs/react/headless'
import { ForwardRefRenderFunction, PropsWithChildren, ReactNode, forwardRef, useImperativeHandle, useRef } from 'react'
import { Instance, Plugin } from 'tippy.js'

export type PopoverImperativeHandle = {
  hide: () => void
  show: () => void
}

export type PopoverProps = PropsWithChildren<{
  trigger: ReactNode
  triggerMode?: string
  triggerTarget?: Element | Element[] | null | undefined
  boundariesElement?: Boundary | null
  boundariesPadding?: Padding
  placement?: Placement
  offset?: [number, number]
  hideOnClick?: boolean
  className?: string
  appendTo?: Element | 'parent' | ((ref: Element) => Element) | undefined
  onHide?: () => void
  onShow?: (instance?: Instance) => void
  disabled?: boolean
  flipEnabled?: boolean
  animation?: boolean
}>

const EXIT_ANIMATION_DURATION = 100

const onTrigger = (instance: Instance<unknown>) => {
  const box = instance.popper.firstElementChild
  requestAnimationFrame(() => {
    box?.classList.add('popover-enter-active')
    box?.classList.remove('popover-exit-active')
  })
}

const hideOnEscPlugin: Plugin = {
  name: 'hideOnEsc',
  defaultValue: true,
  fn: ({ hide }) => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hide()
      }
    }
    return {
      onShow() {
        document.addEventListener('keydown', onKeyDown)
      },
      onHide() {
        document.removeEventListener('keydown', onKeyDown)
      },
    }
  },
}

const _Popover: ForwardRefRenderFunction<PopoverImperativeHandle | undefined, PopoverProps> = (
  {
    hideOnClick = true,
    onHide,
    onShow,
    appendTo,
    triggerTarget,
    triggerMode = 'click',
    placement = 'bottom-start',
    children,
    offset = [0, 8],
    trigger,
    className,
    disabled,
    flipEnabled = true,
    boundariesElement,
    animation = true,
    boundariesPadding,
  },
  ref
) => {
  const tippyRef = useRef<Instance>()

  useImperativeHandle(ref, () => ({
    hide: () => tippyRef.current?.hide(),
    show: () => tippyRef.current?.show(),
    unmount: () => tippyRef.current?.unmount(),
  }))

  return (
    <Tippy
      maxWidth="100vw"
      disabled={disabled}
      trigger={triggerMode}
      hideOnClick={hideOnClick}
      appendTo={appendTo}
      interactive
      animation
      triggerTarget={triggerTarget}
      onCreate={(instance) => {
        tippyRef.current = instance
      }}
      plugins={[hideOnEscPlugin]}
      onTrigger={onTrigger}
      onShow={(instance) => {
        onTrigger(instance)
        onShow?.(instance)
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
      render={(attrs) => {
        return (
          <ContentContainer {...attrs} className={className} animation={animation}>
            {children}
          </ContentContainer>
        )
      }}
      popperOptions={{
        modifiers: [
          { name: 'flip', enabled: flipEnabled },
          {
            name: 'preventOverflow',
            enabled: !!boundariesElement,
            options: {
              boundary: boundariesElement,
              padding: boundariesPadding,
            },
          },
        ],
      }}
      placement={placement}
      offset={offset}
    >
      <TriggerContainer tabIndex={1} isTrigger={!!trigger}>
        {trigger}
      </TriggerContainer>
    </Tippy>
  )
}

const TriggerContainer = styled.div<{ isTrigger: boolean }>`
  /* if we use triggerElement, don't set height */
  height: ${({ isTrigger }) => (isTrigger ? 'max-content' : 'unset')};
`

const ContentContainer = styled.div<{ animation?: boolean }>`
  transition: ${({ animation }) => (animation ? ' 150ms cubic-bezier(0.25, 0.01, 0.25, 1)' : 'unset')};
  opacity: 0;
  transform: scale(0.88);

  &.popover-enter-active {
    opacity: 1;
    transform: scale(1);
  }

  &.popover-exit-active {
    opacity: 0;
    transform: scale(0.88);
    transition: ${({ animation }) =>
      animation ? `${EXIT_ANIMATION_DURATION}ms cubic-bezier(0.25, 0.01, 0.25, 1) ` : 'unset'};
  }
`

export const Popover = forwardRef(_Popover)
Popover.displayName = 'Popover'

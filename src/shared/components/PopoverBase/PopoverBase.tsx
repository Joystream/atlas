import styled from '@emotion/styled'
import { Placement } from '@popperjs/core'
import Tippy from '@tippyjs/react/headless'
import React from 'react'

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
      render={(attrs) => (
        <div {...attrs} className={className}>
          {content}
        </div>
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

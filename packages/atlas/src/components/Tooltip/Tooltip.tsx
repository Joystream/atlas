import Tippy, { TippyProps } from '@tippyjs/react/headless'
import { FC, PropsWithChildren, ReactNode, RefObject, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { transitions } from '@/styles'

import {
  IconWrapper,
  StyledSvgAlertsInformative24,
  TooltipContainer,
  TooltipContent,
  TooltipHeader,
  TooltipText,
} from './Tooltip.styles'

type Placement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'top'
export type TooltipProps = PropsWithChildren<{
  text?: string
  headerText?: string
  icon?: boolean
  placement?: Placement
  offsetX?: number
  offsetY?: number
  delay?: number | [number | null, number | null] | undefined
  hideOnClick?: boolean | 'toggle'
  reference?: Element | RefObject<Element> | null | undefined
  customContent?: ReactNode
  showOnCreate?: boolean
  multiline?: boolean
  className?: string
}> &
  Pick<TippyProps, 'delay'>

export const Tooltip: FC<TooltipProps> = ({
  text,
  headerText,
  icon,
  children,
  reference,
  hideOnClick,
  placement = 'bottom-start',
  offsetX = 0,
  offsetY = 8,
  delay,
  customContent,
  showOnCreate,
  multiline,
  className,
  ...tippyProps
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const content = customContent ? (
    customContent
  ) : (
    <TooltipContent headerText={!!headerText}>
      <TooltipHeader headerText={!!headerText}>
        {icon && (
          <IconWrapper>
            <StyledSvgAlertsInformative24 />
          </IconWrapper>
        )}
        {headerText && (
          <TooltipText as="span" variant="h100">
            {headerText}
          </TooltipText>
        )}
      </TooltipHeader>
      {text && text.length && (
        <TooltipText as="span" withIcon={!!icon} headerText={!!headerText} variant="t100">
          {text}
        </TooltipText>
      )}
    </TooltipContent>
  )

  if (!text && !customContent) {
    return <>{children}</>
  }

  return (
    <Tippy
      {...tippyProps}
      delay={delay}
      onMount={() => setIsVisible(true)}
      hideOnClick={hideOnClick}
      onHide={() => setIsVisible(false)}
      placement={placement}
      reference={reference}
      offset={[offsetX, offsetY]}
      showOnCreate={showOnCreate}
      render={(attrs) => (
        <CSSTransition
          in={isVisible}
          timeout={parseInt(transitions.timings.sharp)}
          classNames={transitions.names.fade}
          unmountOnExit
        >
          <TooltipContainer
            {...attrs}
            hasHeader={!!headerText && !!headerText.length}
            hasCustomContent={!!customContent}
            multiline={!!multiline}
          >
            {content}
          </TooltipContainer>
        </CSSTransition>
      )}
    >
      {children ? (
        <span tabIndex={0} className={className}>
          {children}
        </span>
      ) : undefined}
    </Tippy>
  )
}

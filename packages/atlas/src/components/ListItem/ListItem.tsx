import { To } from 'history'
import { MouseEvent, ReactNode, forwardRef } from 'react'
import mergeRefs from 'react-merge-refs'

import { useHover } from '@/hooks/useHover'
import { getLinkPropsFromTo } from '@/utils/button'

import {
  Caption,
  Container,
  LabelCaptionContainer,
  LabelContainer,
  LabelText,
  ListItemSizes,
  NodeContainer,
  SelectedIcon,
} from './ListItem.styles'

export type ListItemProps = {
  label: ReactNode
  caption?: ReactNode
  asButton?: boolean
  selected?: boolean
  disabled?: boolean
  // indicative that onClick will perform a destructive action of some kind
  destructive?: boolean
  size?: ListItemSizes
  nodeStart?: ReactNode
  nodeEnd?: ReactNode
  captionPosition?: 'right' | 'bottom'
  onClick?: (e: MouseEvent) => void
  className?: string
  highlight?: boolean
  highlightWhenActive?: boolean
  to?: To
  externalLink?: {
    href: string
    download?: string
  }
}

export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      label,
      size = 'medium',
      caption,
      asButton,
      captionPosition = 'bottom',
      disabled,
      destructive,
      selected,
      nodeStart,
      nodeEnd,
      onClick,
      className,
      highlight,
      highlightWhenActive,
      to,
      externalLink,
    },
    ref
  ) => {
    const [hoverRef, isHovering] = useHover<HTMLDivElement>()
    const linkProps = getLinkPropsFromTo(to)
    return (
      <Container
        highlight={highlight}
        as={externalLink ? 'a' : asButton ? 'button' : undefined}
        className={className}
        onClick={onClick}
        disabled={disabled}
        hasNodeStart={!!nodeStart}
        size={size}
        ref={mergeRefs([hoverRef, ref])}
        highlightWhenActive={highlightWhenActive && selected}
        {...linkProps}
        {...externalLink}
      >
        {!!nodeStart && (
          <NodeContainer isSelected={selected} isHovering={isHovering} destructive={destructive}>
            {nodeStart}
          </NodeContainer>
        )}
        <LabelCaptionContainer captionBottom={captionPosition === 'bottom'}>
          <LabelContainer>
            <LabelText
              as="span"
              variant="t200-strong"
              color={destructive ? 'colorTextError' : isHovering || selected || highlight ? undefined : 'colorText'}
            >
              {label}
            </LabelText>
          </LabelContainer>
          <Caption as="span" captionPosition={captionPosition} color="colorText" variant="t100">
            {caption}
          </Caption>
        </LabelCaptionContainer>
        {selected && <SelectedIcon />}
        {!!nodeEnd && (
          <NodeContainer isSelected={selected} isHovering={isHovering} destructive={destructive}>
            {nodeEnd}
          </NodeContainer>
        )}
      </Container>
    )
  }
)

ListItem.displayName = 'ListItem'

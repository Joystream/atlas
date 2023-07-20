import { To } from 'history'
import { MouseEvent, ReactNode, forwardRef, useMemo } from 'react'
import { mergeRefs } from 'react-merge-refs'

import { ListItemSeparator } from '@/components/ListItem/ListItemSeparator'
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
  isSeparator?: boolean
  isInteractive?: boolean
  protected?: {
    title: string
    description: string
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
      isSeparator,
      isInteractive = true,
    },
    ref
  ) => {
    const [hoverRef, isHovering] = useHover<HTMLDivElement>()
    const linkProps = getLinkPropsFromTo(to)

    const labelColor = useMemo(() => {
      if (destructive) {
        return 'colorTextError'
      }
      if (isSeparator) {
        return 'colorTextMuted'
      }
      if (isInteractive && (isHovering || selected || highlight)) {
        return
      }
      return 'colorText'
    }, [destructive, highlight, isHovering, isInteractive, isSeparator, selected])

    return (
      <>
        {isSeparator && <ListItemSeparator />}
        <Container
          highlight={highlight || (highlightWhenActive && selected)}
          as={externalLink ? 'a' : asButton ? 'button' : undefined}
          className={className}
          onClick={onClick}
          disabled={disabled}
          hasNodeStart={!!nodeStart}
          size={size}
          isSeparator={isSeparator}
          isInteractive={isInteractive}
          ref={mergeRefs([hoverRef, ref])}
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
              <LabelText as="span" variant={isSeparator ? 'h100' : 't200-strong'} color={labelColor}>
                {label}
              </LabelText>
            </LabelContainer>
            <Caption as="span" captionPosition={captionPosition} color="colorText" variant="t100">
              {caption}
            </Caption>
          </LabelCaptionContainer>
          {selected && <SelectedIcon />}
          {!!nodeEnd && (
            <NodeContainer isSelected={selected} isHovering={isInteractive && isHovering} destructive={destructive}>
              {nodeEnd}
            </NodeContainer>
          )}
        </Container>
      </>
    )
  }
)

ListItem.displayName = 'ListItem'

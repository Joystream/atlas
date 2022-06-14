import { MouseEvent, ReactNode, forwardRef } from 'react'
import mergeRefs from 'react-merge-refs'

import { useHover } from '@/hooks/useHover'
import { cVar } from '@/styles'

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
}

export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      label,
      size = 'medium',
      caption,
      captionPosition = 'bottom',
      disabled,
      destructive,
      selected,
      nodeStart,
      nodeEnd,
      onClick,
      className,
      highlight,
    },
    ref
  ) => {
    const [hoverRef, isHovering] = useHover<HTMLDivElement>()
    return (
      <Container
        highlight={highlight}
        className={className}
        onClick={onClick}
        disabled={disabled}
        hasNodeStart={!!nodeStart}
        size={size}
        ref={mergeRefs([hoverRef, ref])}
      >
        {!!nodeStart && (
          <NodeContainer isSelected={selected} isHovering={isHovering} destructive={destructive}>
            {nodeStart}
          </NodeContainer>
        )}
        <LabelCaptionContainer captionBottom={captionPosition === 'bottom'}>
          <LabelContainer>
            <LabelText
              variant="t200-strong"
              secondary={!selected}
              color={
                destructive
                  ? cVar('colorTextError')
                  : isHovering || selected || highlight
                  ? cVar('colorTextStrong')
                  : cVar('colorText')
              }
            >
              {label}
            </LabelText>
          </LabelContainer>
          <Caption captionPosition={captionPosition} secondary variant="t100">
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

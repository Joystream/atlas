import React from 'react'

import { Text } from '@/components/Text'
import { cVar } from '@/styles'

import {
  Caption,
  Container,
  LabelCaptionContainer,
  LabelContainer,
  NodeContainer,
  SelectedIcon,
} from './ListItem.styles'

export type ListItemSizes = 'small' | 'medium' | 'large'

export type ListItemProps = {
  label: string
  selected?: boolean
  disabled?: boolean
  // indicative that onClick will perform a destructive action of some kind
  destructive?: boolean
  size?: ListItemSizes
  nodeStart?: React.ReactNode
  nodeEnd?: React.ReactNode
  caption?: string
  captionPosition?: 'right' | 'bottom'
  onClick?: () => void
}

export const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
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
    },
    ref
  ) => {
    return (
      <Container onClick={onClick} disabled={disabled} hasNodeStart={!!nodeStart} size={size} ref={ref}>
        {!!nodeStart && <NodeContainer destructive={destructive}>{nodeStart}</NodeContainer>}
        <LabelCaptionContainer captionBottom={captionPosition === 'bottom'}>
          <LabelContainer>
            <Text variant="t200-strong" color={destructive ? cVar('colorTextError') : undefined}>
              {label}
            </Text>
          </LabelContainer>
          <Caption captionPosition={captionPosition} secondary variant="t100">
            {caption}
          </Caption>
        </LabelCaptionContainer>
        {selected && <SelectedIcon />}
        {!!nodeEnd && <NodeContainer destructive={destructive}>{nodeEnd}</NodeContainer>}
      </Container>
    )
  }
)

ListItem.displayName = 'ListItem'

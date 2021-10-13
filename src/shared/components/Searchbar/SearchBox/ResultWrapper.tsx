import React from 'react'

import { ShortcutIndicator } from '@/shared/components/ShortcutIndicator'
import { Text } from '@/shared/components/Text'
import { SvgGlyphClose } from '@/shared/icons'

import { DeleteButton, SearchItemContent, SearchItemWrapper, Shortcut } from './SearchBox.style'

type SearchItemProps = {
  to: string
  onDelete?: () => void
  onClick?: () => void
  variant?: 'default' | 'textOnly'
}

export const ResultWrapper: React.FC<SearchItemProps> = ({ to, onDelete, children, onClick, variant = 'default' }) => {
  return (
    <SearchItemWrapper to={to} onClick={onClick} variant={variant}>
      <SearchItemContent>{children}</SearchItemContent>
      <Shortcut>
        <Text secondary variant="caption">
          Select
        </Text>
        <ShortcutIndicator>↩</ShortcutIndicator>
      </Shortcut>
      {onDelete && (
        <DeleteButton
          size="small"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onDelete()
          }}
          variant="tertiary"
        >
          <SvgGlyphClose />
        </DeleteButton>
      )}
    </SearchItemWrapper>
  )
}

import React from 'react'

import { ShortcutIndicator } from '@/shared/components/ShortcutIndicator'
import { Text } from '@/shared/components/Text'
import { SvgGlyphClose } from '@/shared/icons'

import { DeleteButton, SearchItemContent, SearchItemWrapper, Shortcut } from './SearchBox.style'

type SearchItemProps = {
  to: string
  onDelete?: () => void
  onClick?: () => void
}

export const ResultWrapper: React.FC<SearchItemProps> = ({ to, onDelete, children, onClick }) => {
  return (
    <SearchItemWrapper to={to} onClick={onClick}>
      <SearchItemContent>{children}</SearchItemContent>
      <Shortcut>
        <Text secondary variant="caption">
          Select
        </Text>
        <ShortcutIndicator>↩</ShortcutIndicator>
      </Shortcut>
      {onDelete && (
        <DeleteButton
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

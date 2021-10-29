import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

import { ShortcutIndicator } from '@/shared/components/ShortcutIndicator'
import { Text } from '@/shared/components/Text'
import { SvgGlyphClose } from '@/shared/icons'

import { DeleteButton, SearchItemContent, SearchItemWrapper, Shortcut } from './SearchBox.style'

type SearchItemProps = {
  to: string
  onDelete?: () => void
  onClick?: () => void
  variant?: 'default' | 'textOnly'
  selected?: boolean
  handleSelectedItem: (top: number) => void
  selectedItem: null | number
}

export const ResultWrapper: React.FC<SearchItemProps> = ({
  to,
  onDelete,
  children,
  onClick,
  selected,
  handleSelectedItem,
  variant = 'default',
  selectedItem,
}) => {
  const wrapperRef = useRef<HTMLAnchorElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && selected && to) {
        event.preventDefault()
        navigate(to)
      }
    }
    window.addEventListener('keydown', onKeyPress)
    return () => {
      window.removeEventListener('keydown', onKeyPress)
    }
  }, [navigate, selected, to])

  useEffect(() => {
    if (selected && wrapperRef.current) {
      handleSelectedItem(wrapperRef.current.offsetTop)
    }
  }, [handleSelectedItem, selected])

  return (
    <SearchItemWrapper
      to={to}
      onClick={onClick}
      selected={selected}
      ref={wrapperRef}
      variant={variant}
      selectedItem={selectedItem}
    >
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

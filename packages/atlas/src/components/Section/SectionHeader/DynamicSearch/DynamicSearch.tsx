import { FC } from 'react'

import { SvgActionClose, SvgActionSearch } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { InputProps } from '@/components/_inputs/Input'

import { SearchInput, SectionSearchWrapper } from './DynamicSearch.styles'

export type SearchProps = Omit<InputProps, 'size' | 'actionButton' | 'nodeStart' | 'type' | 'placeholder'>

type DynamicSearchProps = {
  search: SearchProps
  isOpen: boolean
  onSearchToggle: (isOpen: boolean) => void
}

export const DynamicSearch: FC<DynamicSearchProps> = ({ isOpen, onSearchToggle, search }) => {
  return (
    <SectionSearchWrapper isMobileSearchOpen={isOpen}>
      {isOpen ? (
        <SearchInput
          {...search}
          actionButton={{
            onClick: () => onSearchToggle(false),
            icon: <SvgActionClose />,
          }}
          nodeStart={<Button icon={<SvgActionSearch />} variant="tertiary" />}
          size="medium"
          placeholder="Search"
          type="search"
        />
      ) : (
        <Button
          icon={<SvgActionSearch />}
          onClick={() => {
            onSearchToggle(true)
          }}
          variant="tertiary"
        />
      )}
    </SectionSearchWrapper>
  )
}

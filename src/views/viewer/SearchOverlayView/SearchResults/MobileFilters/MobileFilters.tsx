import React from 'react'

import { languages } from '@/config/languages'
import { Button } from '@/shared/components/Button'
import { StyledSelect } from '@/shared/components/Tabs/Tabs.styles'
import { Text } from '@/shared/components/Text'
import { SvgGlyphClose } from '@/shared/icons'

import { ActionButton, Actions, Content, Header, Title } from './MobileFilters.style'

type MobileFiltersProps = {
  onClose: () => void
}

export const MobileFilters: React.FC<MobileFiltersProps> = ({ onClose }) => {
  return (
    <>
      <Header>
        <Text variant="h5">Filters</Text>
        <Button icon={<SvgGlyphClose />} iconOnly onClick={onClose} variant="tertiary" />
      </Header>
      <Content>
        <Title secondary variant="overhead">
          Language
        </Title>
        <StyledSelect items={languages} placeholder="Any language" size="small" />
      </Content>
      <Actions>
        <ActionButton fullWidth>Apply</ActionButton>
        <ActionButton fullWidth variant="secondary">
          Clear
        </ActionButton>
      </Actions>
    </>
  )
}

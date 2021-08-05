import styled from '@emotion/styled'
import React from 'react'

import { ViewWrapper } from '@/components'
import { Text } from '@/shared/components'
import { sizes } from '@/shared/theme'

export const NewView = () => {
  return (
    <ViewWrapper>
      <Header variant="h2">New & Noteworthy</Header>
    </ViewWrapper>
  )
}

const Header = styled(Text)`
  margin-top: ${sizes(16)};
`

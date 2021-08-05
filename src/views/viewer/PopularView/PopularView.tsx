import styled from '@emotion/styled'
import React from 'react'

import { ViewWrapper } from '@/components'
import { Text } from '@/shared/components'
import { sizes } from '@/shared/theme'

export const PopularView = () => {
  return (
    <ViewWrapper>
      <Header variant="h2">Popular</Header>
    </ViewWrapper>
  )
}

const Header = styled(Text)`
  margin-top: ${sizes(16)};
`

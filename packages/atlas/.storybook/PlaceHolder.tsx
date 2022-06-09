import styled from '@emotion/styled'
import React from 'react'

import { Text } from '@/components/Text'
import { SvgActionInformative } from '@/components/_icons'

export const PlaceHolder: React.FC = () => {
  return (
    <PlaceHolderWrapper>
      <StyledSvgActionInformative />
      <PlaceholderTitle variant="t100-strong" color="#7b61ff">
        This is a placeholder for children.
      </PlaceholderTitle>
      <PlaceholderDescription variant="t100" color="#7b61ff">
        Children will be placed here
      </PlaceholderDescription>
    </PlaceHolderWrapper>
  )
}

const StyledSvgActionInformative = styled(SvgActionInformative)`
  path {
    fill: #7b61ff;
  }
`

const PlaceHolderWrapper = styled.div`
  border: 1px dashed #7b61ff;
  font-size: 12px;
  border-radius: 5px;
  background-color: #7b61ff1a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
  min-height: 200px;
`

const PlaceholderTitle = styled(Text)`
  text-align: center;
  margin-top: 8px;
  margin-bottom: 0;
  font-weight: 700;
`

const PlaceholderDescription = styled(Text)`
  text-align: center;
  margin-top: 8px;
`

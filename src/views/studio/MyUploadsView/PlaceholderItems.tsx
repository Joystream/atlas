import React from 'react'
import styled from '@emotion/styled'
import { breakpoints, colors } from '@/shared/theme'
import { Placeholder } from '@/shared/components'
import {
  Container,
  AssetsGroupBarUploadContainer,
  AssetsInfoContainer,
  UploadInfoContainer,
} from './AssetsGroupUploadBar/AssetsGroupUploadBar.style'

const Placeholders = () => {
  return (
    <Container>
      <AssetsGroupBarUploadContainer style={{ backgroundColor: `${colors.gray[800]}` }}>
        <StyledPlaceholderThumbnail width="72px" height="48px" />
        <AssetsInfoContainer>
          <Placeholder width="120px" height="14px" />
          <Placeholder width="60px" height="14px" />
        </AssetsInfoContainer>
        <UploadInfoContainer>
          <Placeholder width="100px" height="14px" />
          <Placeholder width="36px" height="36px" rounded style={{ marginLeft: '24px', marginRight: '8px' }} />
        </UploadInfoContainer>
      </AssetsGroupBarUploadContainer>
    </Container>
  )
}

const StyledPlaceholderThumbnail = styled(Placeholder)`
  display: none;
  @media screen and (min-width: ${breakpoints.small}) {
    display: block;
  }
`

export const placeholderItems = Array(5).fill(Placeholders)

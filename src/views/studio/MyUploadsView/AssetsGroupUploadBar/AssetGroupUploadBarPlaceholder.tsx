import styled from '@emotion/styled'
import React from 'react'

import { Placeholder } from '@/shared/components'
import { colors, media } from '@/shared/theme'

import {
  Container,
  AssetsGroupUploadBarContainer,
  AssetsInfoContainer,
  UploadInfoContainer,
} from './AssetsGroupUploadBar.style'

export const AssetGroupUploadBarPlaceholder: React.FC = () => {
  return (
    <Container>
      <AssetsGroupUploadBarContainer style={{ backgroundColor: `${colors.gray[800]}` }}>
        <StyledPlaceholderThumbnail width="72px" height="48px" />
        <AssetsInfoContainer>
          <Placeholder width="120px" height="14px" />
          <Placeholder width="60px" height="14px" />
        </AssetsInfoContainer>
        <UploadInfoContainer>
          <Placeholder width="100px" height="14px" />
          <Placeholder width="36px" height="36px" rounded style={{ marginLeft: '24px', marginRight: '8px' }} />
        </UploadInfoContainer>
      </AssetsGroupUploadBarContainer>
    </Container>
  )
}

const StyledPlaceholderThumbnail = styled(Placeholder)`
  display: none;

  ${media.small} {
    display: block;
  }
`

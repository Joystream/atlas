import styled from '@emotion/styled'
import React from 'react'

import { SkeletonLoader } from '@/components/SkeletonLoader'
import { colors, media } from '@/theme'

import {
  AssetsInfoContainer,
  Container,
  UploadInfoContainer,
  UploadStatusGroupContainer,
} from './UploadStatusGroup.style'

export const UploadStatusGroupSkeletonLoader: React.FC = () => {
  return (
    <Container>
      <UploadStatusGroupContainer style={{ backgroundColor: `${colors.gray[800]}` }}>
        <StyledSkeletonLoaderThumbnail width="72px" height="48px" />
        <AssetsInfoContainer>
          <SkeletonLoader width="120px" height="14px" />
          <SkeletonLoader width="60px" height="14px" />
        </AssetsInfoContainer>
        <UploadInfoContainer>
          <SkeletonLoader width="100px" height="14px" />
          <SkeletonLoader width="36px" height="36px" rounded style={{ marginLeft: '24px', marginRight: '8px' }} />
        </UploadInfoContainer>
      </UploadStatusGroupContainer>
    </Container>
  )
}

const StyledSkeletonLoaderThumbnail = styled(SkeletonLoader)`
  display: none;

  ${media.xs} {
    display: block;
  }
`

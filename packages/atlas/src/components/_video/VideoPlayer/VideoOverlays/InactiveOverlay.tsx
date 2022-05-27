import styled from '@emotion/styled'
import { FC } from 'react'

import { Loader } from '@/components/_loaders/Loader'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { InnerContainer, OverlayBackground, OverlayContent, OverlayHeading } from './VideoOverlays.styles'

export const InactiveOverlay: FC = () => {
  const smMatch = useMediaMatch('sm')
  const xsMatch = useMediaMatch('xs')
  const loaderVariant = xsMatch ? (smMatch ? 'xlarge' : 'large') : 'compact'
  return (
    <OverlayBackground>
      <InnerContainer>
        <StyledLoader variant={loaderVariant} />
        <OverlayHeading variant={smMatch ? 'h600' : 'h400'}>
          This video hasn&apos;t finished uploading yet...
        </OverlayHeading>
        <OverlayContent variant={smMatch ? 't300' : 't200'} secondary>
          Please try again in a few minutes
        </OverlayContent>
      </InnerContainer>
    </OverlayBackground>
  )
}

export const StyledLoader = styled(Loader)`
  margin: 0 auto;
`

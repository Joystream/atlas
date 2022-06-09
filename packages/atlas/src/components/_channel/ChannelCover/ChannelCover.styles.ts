import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgIllustrativeFileFailed } from '@/components/_icons'
import { SvgBgPattern } from '@/components/_illustrations'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'

export const MediaWrapper = styled.div`
  margin: 0 calc(-1 * var(--size-global-horizontal-padding));
  width: calc(100% + calc(2 * var(--size-global-horizontal-padding)));
  position: relative;
`

export const Media = styled.div`
  width: 100%;
  height: 0;
  padding-top: 25%;
  position: relative;
  z-index: ${zIndex.background};
  background-color: ${cVar('colorCoreNeutral900')};
  overflow: hidden;
`

export const CoverImage = styled.img`
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

export const CoverWrapper = styled.div`
  position: relative;
`

export const EditableControls = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  transition: opacity ${transitions.timings.loading} ${transitions.easing};

  ${media.md} {
    background-color: ${cVar('colorCoreNeutral500Darken')};
    opacity: 0;

    :hover {
      opacity: 1;
    }
  }
`

export const EditCoverDesktopOverlay = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${cVar('colorCoreNeutral200')};
  display: none;

  ${media.md} {
    display: flex;
    cursor: pointer;
  }
`

export const EditCoverMobileButton = styled(Button)`
  position: absolute;
  left: var(--size-global-horizontal-padding);
  top: ${sizes(1)};
  background-color: ${cVar('colorCoreNeutral800')};

  &:hover {
    background-color: ${cVar('colorCoreNeutral500Darken')};
  }
  ${media.md} {
    display: none;
  }
`

export const EditButtonMessage = styled(Text)`
  color: ${cVar('colorCoreNeutral100')};
  margin-top: ${sizes(1)};
`

export const FailedUploadContainer = styled.div`
  position: absolute;
  top: ${sizes(16)};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const StyledBackgroundPattern = styled(SvgBgPattern)`
  position: absolute;
  top: 0;
  right: 0;
`

export const StyledSvgIllustrativeFileFailed = styled(SvgIllustrativeFileFailed)`
  path {
    fill: ${cVar('colorCoreNeutral300')};
  }
`

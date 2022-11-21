import styled from '@emotion/styled'

import { SvgControlsConnect } from '@/assets/icons'
import { SvgAppLogoShort } from '@/assets/logos'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const StyledSvgAppLogoShort = styled(SvgAppLogoShort)`
  path {
    fill: ${cVar('colorTextMuted')};
  }
`

export const Content = styled.div`
  margin-top: ${sizes(6)};
`
export const AdditionalSubtitleWrapper = styled.div`
  margin-top: ${sizes(6)};
  margin-bottom: ${sizes(4)};
`
export const AdditionalSubtitle = styled(Text)`
  display: inline;
`

export const DescriptionText = styled(Text)`
  display: block;
`

export const Anchor = styled.a`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`

export const Img = styled.img`
  width: 100%;
`

export const HeaderIconsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: ${sizes(6)} 0;
`

export const StyledSvgControlsConnect = styled(SvgControlsConnect)`
  margin: 0 ${sizes(4)};

  path {
    fill: ${cVar('colorCoreNeutral500')};
  }
`

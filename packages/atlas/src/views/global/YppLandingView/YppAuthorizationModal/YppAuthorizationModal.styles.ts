import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgControlsConnect, SvgLogoYoutube } from '@/assets/icons'
import { SvgAppLogoShort, SvgAppLogoShortMonochrome } from '@/assets/logos'
import { Text } from '@/components/Text'
import { GoogleButton } from '@/components/_buttons/GoogleButton'
import { cVar, media, sizes } from '@/styles'

export const StyledSvgAppLogoShort = styled(SvgAppLogoShort)`
  height: 36px;

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

export const CategoriesText = styled(Text)`
  display: block;
  margin-top: ${sizes(1)};
`

export const LogosWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: start;
  align-items: center;
  gap: ${sizes(4)};
`

const logoStyles = css`
  path {
    fill: ${cVar('colorTextMuted')};
  }
`

export const StyledSvgLogoYoutube = styled(SvgLogoYoutube)`
  ${logoStyles};
`
export const StyledSvgControlsConnect = styled(SvgControlsConnect)`
  path {
    fill: ${cVar('colorCoreNeutral500')};
  }
`
// todo replace with AppLogo
export const StyledAppLogo = styled(SvgAppLogoShortMonochrome)`
  ${logoStyles};
`

export const StyledGoogleButton = styled(GoogleButton)`
  width: 100% !important;
  ${media.sm} {
    width: 250px !important;
  }
`

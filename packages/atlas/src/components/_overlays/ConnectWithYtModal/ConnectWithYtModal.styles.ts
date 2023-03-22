import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgControlsConnect, SvgLogoYoutube } from '@/assets/icons'
import { SvgAppLogoShortMonochrome } from '@/assets/logos'
import { cVar, sizes } from '@/styles'

export const LogosWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: start;
  align-items: center;
  gap: ${sizes(4)};
  margin: ${sizes(6)} 0;
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

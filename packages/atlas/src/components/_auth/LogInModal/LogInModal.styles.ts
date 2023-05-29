import styled from '@emotion/styled'

import { SvgActionHide, SvgActionShow } from '@/assets/icons'
import { AppLogo } from '@/components/AppLogo'
import { Button } from '@/components/_buttons/Button'
import { cVar, sizes } from '@/styles'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(6)};
`

export const TextCointainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(2)};
`

export const StyledAppLogo = styled(AppLogo)`
  max-width: 32px;
  height: auto;
  padding-top: ${sizes(4)};

  path {
    fill: ${cVar('colorText')};
  }
`

export const StyledButton = styled(Button)`
  margin-right: -${sizes(4)};
`

export const StyledShowSvg = styled(SvgActionShow)`
  cursor: pointer;

  path {
    fill: ${cVar('colorCoreNeutral50')};
  }
`

export const StyledHideSvg = styled(SvgActionHide)`
  cursor: pointer;

  path {
    fill: ${cVar('colorCoreNeutral50')};
  }
`

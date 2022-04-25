import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { SvgAlertsWarning24 } from '@/components/_icons'
import { SvgJoystreamLogoIcon, SvgPolkadotLogoIcon } from '@/components/_illustrations'
import { sizes } from '@/styles'

export const StepWrapper = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  padding: var(--local-size-dialog-padding);
`

export const StyledJoystreamLogo = styled(SvgJoystreamLogoIcon)`
  height: 40px;
  width: 40px;
`
export const StyledPolkadotLogo = styled(SvgPolkadotLogoIcon)`
  height: 40px;
  width: 40px;
`

export const StepTitle = styled(Text)`
  margin-top: ${sizes(2)};
`

export const StepSubTitle = styled(Text)`
  margin-top: ${sizes(2)};
  max-width: 500px;
`

export const StepFooter = styled.div`
  position: relative;
  padding: var(--local-size-dialog-padding);
  padding-top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const BottomBarIcon = styled(SvgAlertsWarning24)`
  flex-shrink: 0;
  margin-right: ${sizes(2)};
`

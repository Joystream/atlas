import { Text } from '@/shared/components'
import { SvgGlyphWarning } from '@/shared/icons/GlyphWarning'
import { sizes, colors } from '@/shared/theme'
import styled from '@emotion/styled'

type StepWrapperProps = {
  withBottomBar?: boolean
}

export const StepWrapper = styled.div<StepWrapperProps>`
  width: 100%;
  text-align: center;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  margin-top: ${sizes(10)};
`

export const StyledLogo = styled.img`
  height: 40px;
  width: 40px;
`

export const StepTitle = styled(Text)`
  margin-top: ${sizes(2)};
`

export const StepSubTitle = styled(Text)`
  margin-top: ${sizes(2)};
  max-width: 400px;
`

export const StepFooter = styled.div`
  position: relative;
  background-color: ${colors.gray[800]};
  padding: var(--dialog-padding);
  width: calc(100% + 2 * var(--dialog-padding));
  margin: calc(-1 * var(--dialog-padding));
  margin-top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const BottomBarIcon = styled(SvgGlyphWarning)`
  margin-right: ${sizes(2)};
`

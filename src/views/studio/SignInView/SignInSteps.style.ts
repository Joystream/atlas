import { Button, Icon, Text } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'

type StepWrapperProps = {
  centered?: boolean
}

export const StepWrapper = styled.div<StepWrapperProps>`
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: ${({ centered }) => (centered ? 'center' : 'flex-start')};
  margin-top: ${({ centered }) => (centered ? sizes(12) : sizes(2))};
`

export const StepTitle = styled(Text)`
  line-height: ${sizes(8)};
  margin-top: ${sizes(4)};
  max-width: 400px;
`

export const StepSubTitle = styled(Text)`
  margin-top: ${sizes(2)};
  color: ${colors.gray[200]};
  max-width: 400px;
`
export const StepButton = styled(Button)`
  margin-top: ${sizes(8)};
  margin-bottom: ${sizes(20)};
`

export const BrowserIcon = styled(Icon)`
  width: ${sizes(9)};
  height: ${sizes(9)};
`

export const TermsBox = styled.div`
  text-align: left;
  margin-top: ${sizes(6)};
  position: relative;
  height: 300px;
  width: 100%;
  background-color: ${colors.gray[700]};
  overflow: auto;
`
export const TextWrapper = styled.div`
  margin: ${sizes(9)} ${sizes(8)};
  max-width: 450px;
`
export const TermsParagraph = styled(Text)`
  margin-top: 24px;
  color: ${colors.gray[200]};
`

export const TermsOverlay = styled.div`
  position: sticky;
  left: 0;
  bottom: 0;
  height: 35%;
  width: auto;
  background: linear-gradient(180deg, transparent 0%, ${colors.gray[800]} 100%);
`
export const ScrollButton = styled(Button)`
  border-radius: 100%;
  position: absolute;
  right: ${sizes(6)};
  bottom: ${sizes(6)};
  cursor: pointer;
`
export const CheckboxWrapper = styled.div`
  margin-top: ${sizes(4)};
  width: 100%;
  display: flex;
  justify-content: space-between;
  label span {
    color: ${colors.white};
  }
`

export const ContinueButton = styled(Button)`
  margin-left: auto;
`

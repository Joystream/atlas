import { Icon, Text } from '@/shared/components'
import { sizes, colors } from '@/shared/theme'
import styled from '@emotion/styled'

type StepWrapperProps = {
  centered?: boolean
}

export const StepWrapper = styled.div<StepWrapperProps>`
  width: 100%;
  text-align: ${({ centered }) => (centered ? 'center' : 'left')};
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: ${({ centered }) => (centered ? 'center' : 'flex-start')};
  margin-top: ${({ centered }) => (centered ? sizes(12) : sizes(2))};
  padding-bottom: 60px;
`

export const StepTitle = styled(Text)`
  margin-top: ${sizes(4)};
`

export const StepSubTitle = styled(Text)`
  margin-top: ${sizes(2)};
`

export const BottomBarContainer = styled.div`
  background-color: ${colors.gray[800]};
  width: 100%;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  padding: 20px;
`
export const BottomBarIcon = styled(Icon)`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`

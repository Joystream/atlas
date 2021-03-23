import { Text } from '@/shared/components'
import { sizes, colors } from '@/shared/theme'
import styled from '@emotion/styled'

type StepWrapperProps = {
  centered?: boolean
}

export const StepWrapper = styled.div<StepWrapperProps>`
  width: 100%;
  text-align: ${({ centered }) => (centered ? 'center' : 'left')};
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

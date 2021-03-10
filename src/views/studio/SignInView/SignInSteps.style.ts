import { Button, Icon, Text } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'

export const StepWrapper = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: ${sizes(12)} auto;
`

export const StepTitle = styled(Text)`
  line-height: ${sizes(8)};
  margin-top: ${sizes(4)};
`

export const StepSubTitle = styled(Text)`
  margin-top: ${sizes(2)};
  color: ${colors.gray[200]};
`
export const StepButton = styled(Button)`
  margin-top: ${sizes(8)};
`

export const ChromeIcon = styled(Icon)`
  width: ${sizes(9)};
  height: ${sizes(9)};
`

import styled from '@emotion/styled'
import { colors, sizes } from '@/shared/theme'
import { Text, Icon } from '@/shared/components'

export const StyledIcon = styled(Icon)`
  margin-bottom: ${sizes(4)};
`

export const StyledTitleText = styled(Text)`
  width: 90%;
  margin-bottom: ${sizes(3)};
  word-wrap: break-word;
`

export const StyledDescriptionText = styled(Text)`
  color: ${colors.gray[300]};
  word-wrap: break-word;
`

export const Spinner = styled.div`
  position: relative;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  border: 2px solid ${colors.blue[500]};
  border-left: 2px solid ${colors.gray[200]};
  margin-bottom: ${sizes(3)};
  transform: translateZ(0);
  animation: load 1s infinite linear;
  @keyframes load {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

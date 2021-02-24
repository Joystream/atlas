import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'
import Text from '../Text'

export const MessageWrapper = styled.div`
  position: relative;
  padding: ${sizes(4)};
  border: 1px solid ${colors.gray[700]};
  width: 100%;
  max-width: 450px;
`

export const MessageButton = styled.button`
  position: absolute;
  top: ${sizes(2)};
  right: ${sizes(2)};
  border: none;
  padding: ${sizes(2)};
  cursor: pointer;
  background: none;
  svg {
    width: 16px;
    color: ${colors.white};
  }
`

export const MessageTitle = styled(Text)`
  display: flex;
  align-items: center;
  line-height: ${sizes(5)};
  word-break: break-word;
  svg {
    position: relative;
    top: 0.125em;
    margin-right: ${sizes(2)};
    height: 14px;
  }
`

export const MessageDescription = styled(Text)`
  margin-top: ${sizes(2)};
  line-height: ${sizes(5)};
  color: ${colors.gray[300]};
  word-break: break-word;
`

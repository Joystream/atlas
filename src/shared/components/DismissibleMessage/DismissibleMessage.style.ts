import styled from '@emotion/styled'

import { Button, Text } from '@/shared/components'
import { colors, sizes, typography } from '@/shared/theme'

import { DismissibleMessageVariant } from './DismissibleMessage'

type MessageProps = {
  variant: DismissibleMessageVariant
}

export const MessageHeader = styled.div`
  width: 100%;
  height: ${sizes(8)};
  display: flex;
  align-items: center;
`

export const MessageIconContainer = styled.div`
  width: ${sizes(6)};
  height: ${sizes(6)};
  display: flex;
  justify-content: center;
  align-content: center;
  margin-right: ${sizes(2)};
`

export const MessageTitle = styled(Text)`
  display: flex;
  align-items: center;
  word-break: break-word;
`

export const MessageButtonsContainer = styled.div`
  display: flex;
  margin-left: auto;
`

export const MessageActionButton = styled(Button)`
  display: flex;
  align-items: center;
  padding: ${sizes(2)};
  min-width: auto;
  font-size: ${typography.sizes.body1};
`

export const MessageDescription = styled(Text)`
  margin-top: ${sizes(2)};
  line-height: ${sizes(5)};
  color: ${colors.gray[300]};
  word-break: break-word;
`

export const MessageWrapper = styled.div<MessageProps>`
  position: relative;
  padding: ${sizes(4)};
  box-shadow: ${({ variant }) => variant === 'primary' && `inset 0px 0px 0px 1px ${colors.gray[700]}`};
  width: 100%;
  background-color: ${({ variant }) =>
    variant === 'tertiary' ? colors.gray[700] : variant === 'secondary' ? colors.blue[500] : colors.transparent};
  ${MessageDescription} {
    color: ${({ variant }) => variant === 'secondary' && colors.blue[200]};
  }
`

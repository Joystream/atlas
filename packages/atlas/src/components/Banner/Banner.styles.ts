import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { oldColors, sizes } from '@/styles'

import { BannerVariant } from './Banner'

type BannerProps = {
  variant: BannerVariant
}

export const BannerHeader = styled.div`
  width: 100%;
  height: ${sizes(8)};
  display: flex;
  align-items: center;
`

export const BannerIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: ${sizes(6)};
  height: ${sizes(6)};
  margin-right: ${sizes(2)};
`

export const BannerTitle = styled(Text)`
  display: flex;
  align-items: center;
  word-break: break-word;
`

export const BannerButtonsContainer = styled.div`
  display: flex;
  margin-left: auto;
`

export const BannerActionButton = styled(Button)`
  display: flex;
  align-items: center;
  padding: ${sizes(2)};
  min-width: auto;
`

export const BannerDescription = styled(Text)`
  margin-top: ${sizes(2)};
  line-height: ${sizes(5)};
  color: ${oldColors.gray[300]};
  word-break: break-word;
`

export const BannerWrapper = styled.div<BannerProps>`
  position: relative;
  padding: ${sizes(4)};
  box-shadow: ${({ variant }) => variant === 'primary' && `inset 0 0 0 1px ${oldColors.gray[700]}`};
  width: 100%;
  background-color: ${({ variant }) =>
    variant === 'tertiary'
      ? oldColors.gray[700]
      : variant === 'secondary'
      ? oldColors.blue[500]
      : oldColors.transparent};
  ${BannerDescription} {
    color: ${({ variant }) => variant === 'secondary' && oldColors.blue[200]};
  }
`

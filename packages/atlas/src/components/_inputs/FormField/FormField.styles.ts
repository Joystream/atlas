import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { SvgActionWarning } from '@/components/_icons'
import { cVar, sizes } from '@/styles'

type DenseProps = {
  dense?: boolean
}

export const SwitchWrapper = styled.label`
  display: inline-flex;
  cursor: pointer;
`

export const SwitchTitle = styled(Text)`
  margin-left: ${sizes(3)};
`

export const FormFieldWrapper = styled.div<DenseProps>`
  margin-top: ${({ dense }) => sizes(dense ? 4 : 8)};
  display: block;
  width: 100%;
`

export const FormFieldHeader = styled.header`
  display: flex;
  align-items: center;
  width: 85%;
  word-wrap: break-word;
`

export const StyledInformation = styled(Information)`
  margin-left: ${sizes(1)};
`

export const OptionalText = styled(Text)`
  margin-left: ${sizes(2)};
`

export const FormFieldDescription = styled(Text)`
  width: 85%;
  display: block;
  padding: ${sizes(2)} 0;
  word-wrap: break-word;
`

const errorShake = keyframes`
  from {
    transform: translateX(-${sizes(8)});
  }
`
const errorShakeAnimation = css`
  animation: ${errorShake} ${cVar('animationTransitionCallout')};
`

type ChildrenWrapperProps = {
  isError: boolean
  noMargin: boolean
  disableErrorAnimation?: boolean
}

export const ChildrenWrapper = styled.div<ChildrenWrapperProps>`
  margin-top: ${({ noMargin }) => (noMargin ? 'unset' : sizes(4))};
  ${({ isError, disableErrorAnimation }) => (isError && !disableErrorAnimation ? errorShakeAnimation : null)};
`

export const StyledSvgActionWarning = styled(SvgActionWarning)`
  margin-right: ${sizes(2)};
  flex-shrink: 0;

  path {
    fill: ${cVar('colorTextError')};
  }
`

export const FormFieldFooter = styled.footer`
  margin-top: ${sizes(4)};
  display: flex;
`

import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgActionWarning } from '@/assets/icons'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const SwitchLabel = styled.label`
  display: inline-flex;
  cursor: pointer;
`

export const FormFieldWrapper = styled.div`
  gap: ${sizes(4)};
  display: grid;
  width: 100%;
`
export const FormFieldHeader = styled.header<{ switchable?: boolean }>`
  display: grid;
  gap: ${({ switchable }) => (switchable ? sizes(2) : sizes(1))};
  width: 100%;
`

export const FormFieldTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  word-wrap: break-word;
`

export const StyledInformation = styled(Information)`
  margin-left: ${sizes(1)};
`

export const FormFieldDescription = styled(Text)`
  display: block;
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
  disableErrorAnimation?: boolean
}

export const ChildrenWrapper = styled.div<ChildrenWrapperProps>`
  min-width: 0;
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
  display: flex;
`

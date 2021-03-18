import React from 'react'
import styled from '@emotion/styled'
import { colors } from '@/shared/theme'
import { Icon } from '..'
import { css } from '@emotion/react'

export const Container = styled.div`
  padding: 24px;
  width: 312px;
  background-color: ${colors.gray[800]};
  color: ${colors.white};
`

export const ProgressbarContainer = styled.div`
  width: 24px;
  height: 24px;
`

export const StepsProgressContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

export const TopRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`

export const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

type StepStateProps = {
  completed: boolean
}
export const StepState = styled.div<StepStateProps>`
  width: 24px;
  height: 24px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  ${({ completed }) => [
    completed &&
      `background-color: ${colors.blue[500]};
      border: 2px solid transparent;`,
    completed === false && `border: 2px solid ${colors.gray[300]}`,
  ]};
`

export const Step = styled.div`
  cursor: pointer;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 12px;
  justify-content: space-between;
  align-items: center;
`

export const StepInnerContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 12px;
  align-items: center;
`

export const CheckIcon = styled(Icon)`
  position: relative;
  top: 1px;
`

export const ChecvronIcon = () => (
  <Icon
    css={css`
      flex-shrink: 0;
    `}
    name="chevron-right"
  />
)

export const StyledCheckIcon = ({ ...svgProps }) => <CheckIcon name="check" {...svgProps} />

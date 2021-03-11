import React from 'react'
import styled from '@emotion/styled'
import { colors } from '@/shared/theme'
import { Icon } from '..'

export const Container = styled.div`
  padding: 24px;
  width: 312px;
  background-color: #181c20;
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
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  ${({ completed }) => [
    completed &&
      `background-color: #4038FF;
      border: 2px solid transparent;`,
    completed === false && `border: 2px solid ${colors.gray[300]}`,
  ]};
`

export const Step = styled.div`
  cursor: pointer;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
`

export const StepInnerContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

export const CheckIcon = styled(Icon)`
  position: relative;
  top: 1px;
`
export const StyledCheckIcon = ({ ...svgProps }) => <CheckIcon name="check" {...svgProps} />

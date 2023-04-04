import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const Container = styled.div`
  width: 240px;
  overflow-y: hidden;
  background-color: ${cVar('colorCoreNeutral800')};
`
export const TitleContainer = styled.div`
  padding: ${sizes(4)};
  width: 100%;
  background: ${cVar('colorBackgroundMutedAlpha')};
  display: flex;
  justify-content: space-between;
`

export const StepsContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  background-color: ${cVar('colorCoreNeutral800')};
  position: relative;
  z-index: 1;
`

type StepStateProps = {
  completed: boolean
}
export const StepState = styled.div<StepStateProps>`
  width: ${sizes(6)};
  height: ${sizes(6)};
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  ${({ completed }) => [
    `background-color:${cVar('colorBackgroundAlpha')}`,
    completed && `background-color: ${cVar('colorCoreBlue500')};`,
  ]};
`

export const Step = styled.div<StepStateProps>`
  cursor: ${({ completed }) => (completed ? 'initial' : 'pointer')};
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  padding: ${sizes(4)};

  :hover {
    background-color: ${({ completed }) => !completed && cVar('colorBackgroundMutedAlpha')};
  }
`
export const StepInnerContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${sizes(3)};
  align-items: center;
`

export const RequiredText = styled(Text)`
  margin-left: ${sizes(1)};
`

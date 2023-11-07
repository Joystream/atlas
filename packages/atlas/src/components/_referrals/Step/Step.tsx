import { Text } from '@/components/Text'
import { StyledStepContainer, StyledStepNumberWrapper } from '@/components/_referrals/Step/Step.styles'

type StepProps = {
  stepIdx: number
  isSelected: boolean
  title: string
  onClick: (idx: number) => void
}
export const Step = ({ isSelected, stepIdx, title, onClick }: StepProps) => {
  return (
    <StyledStepContainer gap={6} isSelected={isSelected} flow="row" onClick={() => onClick(stepIdx)}>
      <StyledStepNumberWrapper justifyContent="center">
        <Text as="div" variant="t300">
          {stepIdx}
        </Text>
      </StyledStepNumberWrapper>
      <Text variant="t300" as="div">
        {title}
      </Text>
    </StyledStepContainer>
  )
}

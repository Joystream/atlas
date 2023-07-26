import { ReactNode } from 'react'

import { SvgActionChevronR } from '@/assets/icons'
import { BottomDrawerProps } from '@/components/_overlays/BottomDrawer'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  Container,
  FormContainer,
  PreviewContainer,
  StepContainer,
  StepWrapper,
  StyledBottomDrawer,
  StyledStep,
} from './CrtDrawer.styles'

export type CrtDrawerProps = {
  form?: ReactNode
  preview?: ReactNode
  steps: string[]
  activeStep: number
} & BottomDrawerProps
export const CrtDrawer = ({ form, preview, steps, activeStep, ...drawerProps }: CrtDrawerProps) => {
  const smMatch = useMediaMatch('sm')
  return (
    <StyledBottomDrawer {...drawerProps}>
      <Container>
        <FormContainer>
          <StepWrapper>
            <StepContainer>
              {steps.map((step, idx) => (
                <>
                  {idx > 0 ? <SvgActionChevronR /> : null}
                  <StyledStep
                    showOtherStepsOnMobile
                    title={step}
                    key={idx}
                    number={idx + 1}
                    variant={idx + 1 < activeStep ? 'completed' : idx + 1 === activeStep ? 'current' : 'future'}
                  />
                </>
              ))}
            </StepContainer>
          </StepWrapper>
          {form}
        </FormContainer>
        {smMatch && <PreviewContainer>{preview}</PreviewContainer>}
      </Container>
    </StyledBottomDrawer>
  )
}

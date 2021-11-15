import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { OverlayManagerProvider } from '@/providers/overlayManager'
import { Button } from '@/shared/components/Button'

import { StepperModal } from './StepperModal'

export default {
  title: 'overlays/StepperModal',
  component: StepperModal,
  argTypes: {
    exitButton: { defaultValue: true },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta
type ElementType = {
  step: string
  handleStep: (idx: number) => void
  currentStepIdx: number
}
const Element: React.FC<ElementType> = ({ step, handleStep, currentStepIdx }) => {
  return (
    <>
      <h1>Hello! This is a {step} step!</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => handleStep(currentStepIdx - 1)}>Previous step</Button>
        <Button onClick={() => handleStep(currentStepIdx + 1)}>Next step</Button>
      </div>
    </>
  )
}

const RegularTemplate: Story = (args) => {
  const [currentStepIdx, setCurrentStep] = useState(0)
  const handleStepChange = (idx: number) => {
    if (idx < 0 || idx > steps.length - 1) {
      return
    }
    setCurrentStep(idx)
  }
  const steps = [
    {
      title: 'Add Polkadot plugin',
      element: <Element step="first" handleStep={handleStepChange} currentStepIdx={currentStepIdx} />,
    },
    {
      title: 'Create or select a polkadot account',
      element: <Element step="second" handleStep={handleStepChange} currentStepIdx={currentStepIdx} />,
    },
    {
      title: 'Get FREE tokens and start a channel',
      element: <Element step="third" handleStep={handleStepChange} currentStepIdx={currentStepIdx} />,
    },
  ]

  return <StepperModal show={true} steps={steps} currentStepIdx={currentStepIdx} {...args} />
}

export const Regular = RegularTemplate.bind({})

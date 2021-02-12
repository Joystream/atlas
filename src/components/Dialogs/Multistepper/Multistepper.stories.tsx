import React, { useState } from 'react'
import Multistepper from './Multistepper'
import { Story, Meta } from '@storybook/react'
import { OverlayManagerProvider } from '@/hooks/useOverlayManager'
import { Button } from '@/shared/components'

export default {
  title: 'General components/Multistepper',
  component: Multistepper,
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
  whichStep: string
  handleStep: (idx: number) => void
  currentStep: number
}
const Element: React.FC<ElementType> = ({ whichStep, handleStep, currentStep }) => {
  return (
    <>
      <h1>Hello! This is a {whichStep} step!</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => handleStep(currentStep - 1)}>Previous step</Button>
        <Button onClick={() => handleStep(currentStep + 1)}>Next step</Button>
      </div>
    </>
  )
}

const RegularTemplate: Story = (args) => {
  const [currentStep, setCurrentStep] = useState(0)
  const handleStepChange = (idx: number) => {
    if (idx < 0 || idx > steps.length - 1) {
      return
    }
    setCurrentStep(idx)
  }
  const steps = [
    {
      title: 'Add Polkadot plugin',
      element: <Element whichStep="first" handleStep={handleStepChange} currentStep={currentStep} />,
    },
    {
      title: 'Create or select a polkadot account',
      element: <Element whichStep="second" handleStep={handleStepChange} currentStep={currentStep} />,
    },
    {
      title: 'Get FREE tokens and start a channel',
      element: <Element whichStep="third" handleStep={handleStepChange} currentStep={currentStep} />,
    },
  ]

  return <Multistepper showDialog={true} steps={steps} currentStep={currentStep} {...args} />
}

export const Regular = RegularTemplate.bind({})

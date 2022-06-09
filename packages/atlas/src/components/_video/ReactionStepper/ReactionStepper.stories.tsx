import { Meta, Story } from '@storybook/react'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { usePersonalDataStore } from '@/providers/personalData'

import { ReactionStepper, ReactionStepperProps } from './ReactionStepper'

export default {
  title: 'video/ReactionStepper',
  component: ReactionStepper,
  args: {
    likes: 666,
    dislikes: 420,
    state: 'default',
  },
  argTypes: {
    onReact: { table: { disable: true } },
  },
} as Meta<ReactionStepperProps>

const Template: Story<ReactionStepperProps> = (args) => {
  return (
    <>
      <ReactionStepper {...args} />
      <div style={{ width: '100%', height: '1px', background: '#272D33' }} />
      <p>(Divider is not a part of the component, it's only for presentional purposes)</p>
    </>
  )
}
const InteractableTemplate: Story<ReactionStepperProps> = () => {
  const [likes, setLikes] = useState(6)
  const [dislikes, setDislikes] = useState(9)
  const [state, setState] = React.useState<ReactionStepperProps['state']>('default')
  const [reactionTriggered, setReactionTriggered] = useState<'like' | 'dislike' | null>(null)
  const setReactionPopoverDismission = usePersonalDataStore((state) => state.actions.setReactionPopoverDismission)
  const reactionPopoverDismissed = usePersonalDataStore((state) => state.reactionPopoverDismissed)

  useEffect(() => {
    if (!reactionTriggered) {
      return
    }
    // fake processing state
    const timeout = setTimeout(() => {
      setState(reactionTriggered === 'like' ? 'liked' : 'disliked')
      if (reactionTriggered === 'like') {
        setLikes((prevlikes) => prevlikes + 1)
      } else {
        setDislikes((prevDislikes) => prevDislikes + 1)
      }
      setReactionTriggered(null)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [reactionTriggered])

  const handleReact = async (reaction: 'like' | 'dislike') => {
    setReactionTriggered(reaction)
    setState('processing')
    return true
  }

  return (
    <>
      <ReactionStepper likes={likes} dislikes={dislikes} onReact={handleReact} state={state} />
      <div style={{ width: '100%', height: '1px', background: '#272D33' }} />
      <p>(Divider is not a part of the component, it's only for presentional purposes)</p>
      <Button disabled={!reactionPopoverDismissed} onClick={() => setReactionPopoverDismission(false)}>
        Reset popover
      </Button>
    </>
  )
}

export const Default = Template.bind({})
export const Interactable = InteractableTemplate.bind({})
Interactable.parameters = {
  controls: { hideNoControlsWarning: true },
}

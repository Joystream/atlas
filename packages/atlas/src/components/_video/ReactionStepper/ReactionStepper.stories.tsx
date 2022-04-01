import { Meta, Story } from '@storybook/react'
import React, { useEffect, useState } from 'react'

import { ReactionStepper, ReactionStepperProps } from './ReactionStepper'

export default {
  title: 'video/ReactionStepper',
  component: ReactionStepper,
  args: {
    likes: 0,
    dislikes: 0,
    state: 'default',
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
const InteractableTemplate: Story<ReactionStepperProps> = (args) => {
  const [likes, setLikes] = useState(6)
  const [dislikes, setDislikes] = useState(9)
  const [state, setState] = React.useState<ReactionStepperProps['state']>('default')
  const [reactionTriggered, setReactionTriggered] = useState<'like' | 'dislike' | null>(null)

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

  const handleLike = () => {
    setReactionTriggered('like')
    setState('processing')
  }
  const handleDislike = () => {
    setReactionTriggered('dislike')
    setState('processing')
  }

  return (
    <>
      <ReactionStepper
        {...args}
        likes={likes}
        dislikes={dislikes}
        onLike={handleLike}
        onDislike={handleDislike}
        state={state}
      />
      <div style={{ width: '100%', height: '1px', background: '#272D33' }} />
      <p>(Divider is not a part of the component, it's only for presentional purposes)</p>
    </>
  )
}

export const Default = Template.bind({})
export const Interactable = InteractableTemplate.bind({})

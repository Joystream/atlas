import React, { useState, useEffect } from 'react'
import { useMember } from '@/hooks'
import { Button, RadioButton } from '@/shared/components'

const mockMember = {
  id: '1234',
  handle: 'Channel name',
  avatarUrl: 'https://picsum.photos/200/300',
  channels: [
    {
      id: '5678',
      handle: 'My channel',
      avatarUrl: 'https://picsum.photos/200/300',
    },
    {
      id: '9101120',
      handle: 'My channel #2',
      avatarUrl: 'https://picsum.photos/200/300',
    },
  ],
  activeChannel: {
    id: '5678',
    handle: 'My channel',
    avatarUrl: 'https://picsum.photos/200/300',
  },
}

const PlaygroundMemberChannel = () => {
  const { member, addMember, removeMember, setActiveChannel } = useMember()

  const [selected, setSelected] = useState<string | number>('')
  const [memberString, setMemberString] = useState('')

  const handleActiveChannelChange: (e: React.MouseEvent<HTMLElement>) => void = (e) => {
    const element = e.currentTarget as HTMLInputElement
    setSelected(element.value)
    setActiveChannel(element.value)
  }
  const handleAddMember = () => {
    addMember(mockMember)
  }

  useEffect(() => {
    setMemberString(JSON.stringify(member, null, 4))
  }, [member])

  return (
    <>
      <h1>Member data from local storage</h1>
      <Button onClick={handleAddMember}>Add member</Button>
      <pre>{memberString}</pre>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <p>Select active channel:</p>
        {mockMember.channels.map((channel) => (
          <RadioButton
            key={channel.id}
            name="radio-group"
            value={channel.id}
            selectedValue={selected}
            onClick={handleActiveChannelChange}
            label={channel.handle}
          />
        ))}
      </div>
      <Button onClick={removeMember}>Remove member</Button>
    </>
  )
}

export default PlaygroundMemberChannel

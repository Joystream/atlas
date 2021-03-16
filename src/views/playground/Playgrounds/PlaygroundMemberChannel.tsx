import React, { useState, useEffect } from 'react'
import { useMember } from '@/hooks'
import { Button, RadioButton } from '@/shared/components'

const mockMember = {
  id: '1234',
  activeChannelId: '5678',
}
const channels = ['103123213', '1230123021', '123912399132']

const PlaygroundMemberChannel = () => {
  const { activeMember, setActiveMember, removeActiveMember, setActiveChannel } = useMember()

  const [selected, setSelected] = useState<string | number>('')
  const [memberString, setMemberString] = useState('')

  const handleActiveChannelChange = (e: React.MouseEvent<HTMLInputElement>) => {
    const element = e.currentTarget
    setSelected(element.value)
    setActiveChannel(element.value)
  }
  const handleAddMember = () => {
    setActiveMember(mockMember)
  }

  useEffect(() => {
    setMemberString(JSON.stringify(activeMember, null, 4))
  }, [activeMember])

  return (
    <>
      <h1>Member data from local storage</h1>
      <Button onClick={handleAddMember}>Set member</Button>
      <pre>{memberString}</pre>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <p>Select active channel:</p>
        {channels.map((channel) => (
          <RadioButton
            key={channel}
            name="radio-group"
            value={channel}
            selectedValue={selected}
            onClick={handleActiveChannelChange}
            label={channel}
          />
        ))}
      </div>
      <Button onClick={removeActiveMember}>Remove member</Button>
    </>
  )
}

export default PlaygroundMemberChannel

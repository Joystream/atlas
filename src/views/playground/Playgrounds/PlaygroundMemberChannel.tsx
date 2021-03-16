import React, { useState, useEffect } from 'react'
import { useMember } from '@/hooks'
import { Button, RadioButton } from '@/shared/components'

const mockMember = {
  id: '1234',
  activeChannel: '5678',
}
const channels = ['103123213', '1230123021', '123912399132']

const PlaygroundMemberChannel = () => {
  const { member, setMember, removeMember, setActiveChannel } = useMember()

  const [selected, setSelected] = useState<string | number>('')
  const [memberString, setMemberString] = useState('')

  const handleActiveChannelChange: (e: React.MouseEvent<HTMLElement>) => void = (e) => {
    const element = e.currentTarget as HTMLInputElement
    setSelected(element.value)
    setActiveChannel(element.value)
  }
  const handleAddMember = () => {
    setMember(mockMember)
  }

  useEffect(() => {
    setMemberString(JSON.stringify(member, null, 4))
  }, [member])

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
      <Button onClick={removeMember}>Remove member</Button>
    </>
  )
}

export default PlaygroundMemberChannel

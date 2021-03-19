import React, { useState, useEffect } from 'react'
import { useMembership } from '@/api/hooks'
import { useActiveUser } from '@/hooks'
import { Button, RadioButton } from '@/shared/components'

const mockActiveUser = {
  accountId: '1234',
  memberId: '9101112',
  channelId: '5678',
}
const channels = ['103123213', '1230123021', '123912399132']
const members = ['213124655', '21412412412', '12412412412']

const PlaygroundMemberChannel = () => {
  const { membership, loading, error } = useMembership('adb0010c-f4d6-4104-b2e6-2f785ecc1fa4')
  const { activeUser, setActiveUser, setActiveMember, setActiveChannel, removeActiveUser } = useActiveUser()

  const [selectedChannel, setSelectedChannel] = useState<string | number>('')
  const [selectedMember, setSelectedMember] = useState<string | number>('')
  const [activeUserString, setActiveUserString] = useState('')

  const handleActiveChannelChange = (e: React.MouseEvent<HTMLInputElement>) => {
    const element = e.currentTarget
    setSelectedChannel(element.value)
    setActiveChannel(element.value)
  }
  const handleActiveMemberChange = (e: React.MouseEvent<HTMLInputElement>) => {
    const element = e.currentTarget
    setSelectedMember(element.value)
    setActiveMember(element.value)
  }
  const handleAddUser = () => {
    setActiveUser(mockActiveUser)
  }

  useEffect(() => {
    setActiveUserString(JSON.stringify(activeUser, null, 4))
  }, [activeUser])

  useEffect(() => {
    if (loading) {
      return
    }
    if (error) {
      console.log(error)
    }
    console.log(membership)
  }, [error, loading, membership])

  return (
    <>
      <h1>Account/Member/Channel ID from local storage</h1>
      <Button onClick={handleAddUser}>Set User</Button>
      <pre>{activeUserString}</pre>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <p>Select active channel:</p>
        {channels.map((channel) => (
          <RadioButton
            key={channel}
            name="radio-group"
            value={channel}
            selectedValue={selectedChannel}
            onClick={handleActiveChannelChange}
            label={channel}
          />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <p>Select active member:</p>
        {members.map((member) => (
          <RadioButton
            key={member}
            name="radio-group"
            value={member}
            selectedValue={selectedMember}
            onClick={handleActiveMemberChange}
            label={member}
          />
        ))}
      </div>
      <Button onClick={removeActiveUser}>Remove user</Button>
    </>
  )
}

export default PlaygroundMemberChannel

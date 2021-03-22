import React, { useState, useEffect } from 'react'
import { useMemberships, useChannels } from '@/api/hooks'
import { useActiveUser } from '@/hooks'
import { Button, RadioButton } from '@/shared/components'

const account = 'POLKADOT_ACCOUNT'

const PlaygroundMemberChannel = () => {
  const { activeUser, setActiveUser, setActiveMember, setActiveChannel, removeActiveUser } = useActiveUser()

  const [selectedChannel, setSelectedChannel] = useState('')
  const [selectedMember, setSelectedMember] = useState('')
  const [activeUserString, setActiveUserString] = useState('')

  const { memberships, loading: membershipsLoading, error: membershipsError } = useMemberships({
    where: { accountId_eq: account },
  })

  const { channels, loading: channelsLoading, error: channelsError } = useChannels(
    {
      where: { memberId_eq: selectedMember },
    },
    { skip: selectedMember === '' }
  )

  const handleActiveMemberChange = (e: React.MouseEvent<HTMLInputElement>) => {
    const element = e.currentTarget
    setSelectedMember(element.value)
    setActiveMember(element.value)
  }
  const handleActiveChannelChange = (e: React.MouseEvent<HTMLInputElement>) => {
    const element = e.currentTarget
    setSelectedChannel(element.value)
    setActiveChannel(element.value)
  }

  const handleAddUser = () => {
    setActiveUser({ accountId: account, memberId: selectedMember, channelId: selectedChannel })
  }

  useEffect(() => {
    setActiveUserString(JSON.stringify(activeUser, null, 4))
  }, [activeUser])

  if (membershipsError) {
    throw membershipsError
  }
  if (channelsError) {
    throw channelsError
  }

  return (
    <>
      <h1>Account/Member/Channel ID from local storage</h1>
      <pre>{activeUserString}</pre>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <p>Select active member:</p>
          {membershipsLoading
            ? 'Loading...'
            : memberships?.map((member) => (
                <RadioButton
                  key={member.id}
                  name="radio-group"
                  value={member.id}
                  selectedValue={selectedMember}
                  onClick={handleActiveMemberChange}
                  label={member.handle}
                />
              ))}
        </div>
        <p>Select active channel:</p>
        {channelsLoading
          ? 'Loading...'
          : channels &&
            channels.map((channel) => (
              <RadioButton
                key={channel.id}
                name="radio-group"
                value={channel.id}
                selectedValue={selectedChannel}
                onClick={handleActiveChannelChange}
                label={channel.handle}
              />
            ))}
      </div>
      <Button onClick={handleAddUser}>Set User</Button>
      <Button onClick={removeActiveUser}>Remove user</Button>
    </>
  )
}

export default PlaygroundMemberChannel

import React, { useState, useEffect } from 'react'
import { useMemberships } from '@/api/hooks'
import { useActiveUser } from '@/hooks'
import { BasicMembershipFieldsFragment, BasicChannelFieldsFragment } from '@/api/queries'
import { Button, RadioButton } from '@/shared/components'

const account = 'POLKADOT_ACCOUNT'

const PlaygroundMemberChannel = () => {
  const [selectedChannel, setSelectedChannel] = useState<BasicChannelFieldsFragment>()
  const [selectedMember, setSelectedMember] = useState<BasicMembershipFieldsFragment>()
  const [activeUserString, setActiveUserString] = useState('')

  const { activeUser, setActiveUser, setActiveMember, setActiveChannel, removeActiveUser } = useActiveUser()
  const { memberships, loading: membershipsLoading, error: membershipsError } = useMemberships({
    where: { controllerAccount_eq: account },
  })

  const handleActiveMemberChange = (e: React.MouseEvent<HTMLInputElement>) => {
    const element = e.currentTarget
    const member = memberships?.find((membership) => membership.id === element.value)
    if (!member) {
      return
    }
    setSelectedMember(member)
    setActiveMember(member?.id)
  }
  const handleActiveChannelChange = (e: React.MouseEvent<HTMLInputElement>) => {
    const element = e.currentTarget
    const channel = selectedMember?.channels.find((channel) => channel.id === element.value)
    if (!channel) {
      return
    }
    setSelectedChannel(channel)
    setActiveChannel(channel.id)
  }

  const handleAddUser = () => {
    setActiveUser({ accountId: account, memberId: selectedMember?.id || null, channelId: selectedChannel?.id || null })
  }

  useEffect(() => {
    setActiveUserString(JSON.stringify(activeUser, null, 4))
  }, [activeUser])

  if (membershipsError) {
    throw membershipsError
  }

  return (
    <>
      <h1>Account/Member/Channel ID from local storage</h1>
      <pre>{activeUserString}</pre>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <p>Select active member:</p>
        {membershipsLoading
          ? 'Loading...'
          : memberships?.map((member) => (
              <RadioButton
                key={member.id}
                name="radio-group"
                value={member.id}
                selectedValue={selectedMember?.id}
                onClick={handleActiveMemberChange}
                label={member.handle}
              />
            ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <p>Select active channel:</p>
        {membershipsLoading
          ? 'Loading...'
          : selectedMember &&
            selectedMember.channels.map((channel) => (
              <RadioButton
                key={channel.id}
                name="radio-group"
                value={channel.id}
                selectedValue={selectedChannel?.id}
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

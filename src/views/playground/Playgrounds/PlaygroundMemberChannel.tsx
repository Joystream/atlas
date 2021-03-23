import React, { useState, useEffect } from 'react'
import { useMembership, useChannels } from '@/api/hooks'
import { useActiveUser } from '@/hooks'
import { Button, RadioButton } from '@/shared/components'

const accounts = Array(4)
  .fill('')
  .map((_, idx) => `POLKADOT_ACCOUNT_${idx}`)

const PlaygroundMemberChannel = () => {
  const [selectedAccount, setSelectedAccount] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [activeUserString, setActiveUserString] = useState('')

  const { activeUser, setActiveUser, setActiveChannel, removeActiveUser } = useActiveUser()
  const { membership, loading: membershipsLoading, error: membershipsError } = useMembership(
    {
      where: { controllerAccount: selectedAccount },
    },
    { skip: selectedAccount === '' }
  )
  const { channels, loading: channelsLoading, error: channelsError } = useChannels(
    {
      where: { memberId_eq: membership?.id },
    },
    { skip: membership?.id === undefined }
  )

  const handleActiveAccountChange = (e: React.MouseEvent<HTMLInputElement>) => {
    const element = e.currentTarget
    setSelectedAccount(element.value)
    if (!membership) {
      return
    }
    setActiveUser({ accountId: element.value, memberId: membership?.id, channelId: null })
  }
  const handleActiveChannelChange = (e: React.MouseEvent<HTMLInputElement>) => {
    const element = e.currentTarget
    setSelectedChannel(element.value)
    setActiveChannel(element.value)
  }

  const handleAddUser = () => {
    setActiveUser({ accountId: selectedAccount, memberId: membership?.id || null, channelId: selectedChannel })
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
        <p>Select active account:</p>
        {accounts.map((account) => (
          <RadioButton
            key={account}
            name="radio-group"
            value={account}
            selectedValue={selectedAccount}
            onClick={handleActiveAccountChange}
            label={account}
          />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <p>Selected membership:</p>
        {membershipsLoading ? 'Loading...' : membership?.handle}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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

import { useState } from 'react'

import {
  GetBasicChannelsDocument,
  GetBasicChannelsQuery,
  GetBasicChannelsQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { InputAutocomplete } from '@/components/_inputs/InputAutocomplete'
import { ResolvedAvatar } from '@/views/global/YppLandingView/YppAuthorizationModal/YppAuthorizationSteps'

export const PlaygroundInputAutocomplete = () => {
  const [foundChannel, setFoundChannel] = useState<BasicChannelFieldsFragment | null>(null)
  const [channel, setChannel] = useState<string>('')

  return (
    <div>
      <InputAutocomplete<GetBasicChannelsQuery, GetBasicChannelsQueryVariables, BasicChannelFieldsFragment>
        documentQuery={GetBasicChannelsDocument}
        queryVariablesFactory={(value) => ({ where: { title_startsWith: value } })}
        perfectMatcher={(res, val) => res.channels.find((channel) => channel.title === val)}
        renderItem={(result) =>
          result.channels.map((channel) => ({
            ...channel,
            label: channel.title ?? '',
          }))
        }
        placeholder="Enter channel name"
        value={channel}
        onChange={setChannel}
        onItemSelect={(item) => {
          if (item) {
            setFoundChannel(item)
            setChannel(item.title ?? '')
          }
        }}
        nodeEnd={foundChannel && <ResolvedAvatar channel={foundChannel} size="bid" />}
        clearSelection={() => setFoundChannel(null)}
      />
      <div style={{ marginTop: 20 }}>
        <div>Value: {channel}</div>
        <div>Found channel: {JSON.stringify(foundChannel, null, 2)}</div>
      </div>
    </div>
  )
}

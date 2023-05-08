import { useState } from 'react'

import {
  GetExtendedBasicChannelsDocument,
  GetExtendedBasicChannelsQuery,
  GetExtendedBasicChannelsQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
import {
  BasicChannelFieldsFragment,
  ExtendedBasicChannelFieldsFragment,
} from '@/api/queries/__generated__/fragments.generated'
import { Avatar } from '@/components/Avatar'
import { InputAutocomplete } from '@/components/_inputs/InputAutocomplete'

export const PlaygroundInputAutocomplete = () => {
  const [foundChannel, setFoundChannel] = useState<BasicChannelFieldsFragment | null>(null)
  const [channel, setChannel] = useState<string>('')

  return (
    <div>
      <InputAutocomplete<
        GetExtendedBasicChannelsQuery,
        GetExtendedBasicChannelsQueryVariables,
        ExtendedBasicChannelFieldsFragment
      >
        documentQuery={GetExtendedBasicChannelsDocument}
        queryVariablesFactory={(value) => ({
          where: {
            channel: {
              title_startsWith: value,
            },
          },
        })}
        perfectMatcher={(res, val) =>
          res.extendedChannels.find((extendedChannel) => extendedChannel.channel.title === val)
        }
        renderItem={(result) =>
          result.extendedChannels.map((extendedChannel) => ({
            ...extendedChannel,
            label: extendedChannel.channel.title ?? '',
          }))
        }
        placeholder="Enter channel name"
        value={channel}
        onChange={setChannel}
        onItemSelect={(item) => {
          if (item) {
            setFoundChannel(item.channel)
            setChannel(item.channel.title ?? '')
          }
        }}
        nodeEnd={foundChannel && <Avatar assetUrl={foundChannel.avatarPhoto?.resolvedUrl} size={24} />}
        clearSelection={() => setFoundChannel(null)}
      />
      <div style={{ marginTop: 20 }}>
        <div>Value: {channel}</div>
        <div>Found channel: {JSON.stringify(foundChannel, null, 2)}</div>
      </div>
    </div>
  )
}

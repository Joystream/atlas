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
  const [channel, setChannel] = useState<BasicChannelFieldsFragment | null>(null)

  return (
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
      selectedItem={channel?.id ?? ''}
      onItemSelect={(item) => item && setChannel(item)}
      nodeEnd={channel && <ResolvedAvatar channel={channel} size="bid" />}
      clearSelection={() => setChannel(null)}
    />
  )
}

import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import React, { useRef, useState } from 'react'

import { GetMembershipsDocument, GetMembershipsQuery, GetMembershipsQueryVariables } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { TextFieldWithDropdown } from '@/components/_inputs/TextField/TextFieldWithDropdown'

type Member = {
  id: string | null
  handle: string | null
  avatarUri?: string | null
}

export const WhitelistingMembers = () => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const client = useApolloClient()
  const debouncedHandleUniqueValidation = useRef(
    debouncePromise(async (val?: string) => {
      const {
        data: { memberships },
      } = await client.query<GetMembershipsQuery, GetMembershipsQueryVariables>({
        query: GetMembershipsDocument,
        variables: { where: { handle_startsWith: val } },
      })
      if (memberships.length) {
        setMembers(memberships.map((member) => ({ handle: member.handle, avatarUri: member.avatarUri, id: member.id })))
      }
    }, 500)
  )
  return (
    <div>
      <TextFieldWithDropdown
        items={members.map((member) => ({
          label: member.handle || '',
          nodeStart: <Avatar assetUrl={member.avatarUri} />,
        }))}
        resetOnSelect
        onSelect={(item) => item && setSelectedMembers([item, ...selectedMembers])}
        onChange={debouncedHandleUniqueValidation.current}
      />
      {selectedMembers.map((member, idx) => (
        <div key={idx}>{member}</div>
      ))}
    </div>
  )
}

import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import debouncePromise from 'awesome-debounce-promise'
import React, { useRef, useState } from 'react'

import { GetMembershipsDocument, GetMembershipsQuery, GetMembershipsQueryVariables } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { MemberBadge } from '@/components/MemberBadge'
import { TextFieldWithDropdown } from '@/components/_inputs/TextField/TextFieldWithDropdown'
import { createLookup } from '@/utils/data'

type Member = {
  id: string
  handle: string | null
  avatarUri?: string | null
}

export const WhitelistingMembers = () => {
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const client = useApolloClient()

  const debounceFetchMembers = useRef(
    debouncePromise(async (val?: string, selectedMembers?: Member[]) => {
      if (!val) {
        setMembers([])
        return
      }
      setIsLoading(true)

      const {
        data: { memberships },
      } = await client.query<GetMembershipsQuery, GetMembershipsQueryVariables>({
        query: GetMembershipsDocument,
        variables: { where: { handle_startsWith: val } },
      })
      setIsLoading(false)
      const selectedMembersLookup = selectedMembers ? createLookup(selectedMembers) : {}
      if (memberships.length) {
        const filteredMembers = memberships
          .map(({ handle, id, metadata: { avatar } }) => ({
            handle,
            avatarUri: avatar?.__typename === 'AvatarUri' ? avatar.avatarUri : undefined,
            id,
          }))
          .filter((member) => {
            return !selectedMembersLookup[member.id]
          })
        setMembers(filteredMembers)
      }
    }, 500)
  )

  const handleSelect = (item?: Member) => {
    if (!item) {
      return
    }
    setSelectedMembers((prevItems) => [item, ...prevItems])
    setMembers([])
  }

  const handleDeleteClick = (memberId: string) => {
    const filteredMembers = selectedMembers.filter((member) => member.id !== memberId)
    setSelectedMembers(filteredMembers)
  }

  return (
    <div>
      <TextFieldWithDropdown<Member>
        items={members.map((member) => ({
          label: member.handle || '',
          nodeStart: <Avatar assetUrl={member.avatarUri} />,
          id: member.id,
          handle: member.handle,
          avatarUri: member.avatarUri,
        }))}
        resetOnSelect
        loading={isLoading}
        onSelect={handleSelect}
        onChange={(val) => debounceFetchMembers.current(val, selectedMembers)}
      />
      <MemberBadgesWrapper>
        {selectedMembers.map(({ id, handle, avatarUri }) => (
          <MemberBadge key={id} handle={handle} avatarUri={avatarUri} onDeleteClick={() => handleDeleteClick(id)} />
        ))}
      </MemberBadgesWrapper>
    </div>
  )
}

const MemberBadgesWrapper = styled.div`
  margin-top: 16px;
  display: inline-grid;
  grid-auto-flow: column;
  grid-gap: 8px;
`

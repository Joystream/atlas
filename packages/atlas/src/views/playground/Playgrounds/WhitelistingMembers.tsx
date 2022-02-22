import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import debouncePromise from 'awesome-debounce-promise'
import React, { useRef, useState } from 'react'

import { GetMembershipsDocument, GetMembershipsQuery, GetMembershipsQueryVariables } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { MemberBadge } from '@/components/MemberBadge'
import { SvgActionCancel } from '@/components/_icons'
import { TextFieldWithDropdown } from '@/components/_inputs/TextField/TextFieldWithDropdown'
import { createLookup } from '@/utils/data'

type Member = {
  id: string
  handle?: string | null
  avatarUri?: string | null
}

export const WhitelistingMembers = () => {
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
  const [isNotFound, setIsNotFound] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const client = useApolloClient()

  const debounceFetchMembers = useRef(
    debouncePromise(async (val?: string, selectedMembers?: Member[]) => {
      setIsNotFound(false)
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
      if (!filteredMembers.length) {
        setIsNotFound(true)
      }
    }, 500)
  )

  const handleSelect = (item?: Member) => {
    if (!item || isNotFound) {
      return
    }
    setSelectedMembers((prevItems) => [item, ...prevItems])
    setMembers([])
  }

  const handleDeleteClick = (memberId: string) => {
    const filteredMembers = selectedMembers.filter((member) => member.id !== memberId)
    setSelectedMembers(filteredMembers)
  }

  const dropdownItems = members.map((member) => ({
    label: member.handle || '',
    nodeStart: <Avatar assetUrl={member.avatarUri} />,
    id: member.id,
    handle: member.handle,
    avatarUri: member.avatarUri,
  }))

  const notFoundListItem = {
    id: 'not-found',
    label: 'We couldn’t find this member. Please check if spelling is correct.',
    nodeStart: <SvgActionCancel />,
  }

  return (
    <div>
      <TextFieldWithDropdown<Member>
        items={dropdownItems}
        placeholder={selectedMembers.length ? 'Enter another member handle' : 'Enter member handle'}
        notFoundNode={isNotFound ? notFoundListItem : null}
        resetOnSelect
        loading={isLoading}
        onSelectedItemChange={handleSelect}
        onInputValueChange={(val) => debounceFetchMembers.current(val, selectedMembers)}
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

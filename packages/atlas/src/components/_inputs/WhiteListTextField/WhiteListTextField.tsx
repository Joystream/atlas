import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import React, { useRef, useState } from 'react'

import { GetMembershipsDocument, GetMembershipsQuery, GetMembershipsQueryVariables } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { SvgActionCancel } from '@/components/_icons'
import { createLookup } from '@/utils/data'
import { SentryLogger } from '@/utils/logs'

import { MemberBadgesWrapper, StyledMemberBadge, StyledSelectedText } from './WhiteListTextField.styles'

import { TextFieldWithDropdown } from '../TextFieldWithDropdown'

export type Member = {
  id: string
  handle?: string | null
  avatarUri?: string | null
}

type WhiteListTextFieldProps = {
  selectedMembers: Member[]
  setSelectedMembers: React.Dispatch<React.SetStateAction<Member[]>>
}

export const WhiteListTextField: React.FC<WhiteListTextFieldProps> = ({ selectedMembers, setSelectedMembers }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const client = useApolloClient()
  const [isError, setIsError] = useState(false)

  const debounceFetchMembers = useRef(
    debouncePromise(async (val?: string, selectedMembers?: Member[]) => {
      if (!val) {
        setMembers([])
        return
      }
      try {
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
      } catch (error) {
        SentryLogger.error('Failed to fetch memberships', 'WhiteListTextField', error)
        setIsError(true)
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

  const dropdownItems = members.map((member) => ({
    label: member.handle || '',
    nodeStart: <Avatar assetUrl={member.avatarUri} />,
    id: member.id,
    handle: member.handle,
    avatarUri: member.avatarUri,
  }))

  const notFoundNode = {
    label: `We couldn't find this member. Please check if spelling is correct.`,
    nodeStart: <SvgActionCancel />,
  }

  return (
    <div>
      <TextFieldWithDropdown<Member>
        items={dropdownItems}
        placeholder={selectedMembers.length ? 'Enter another member handle' : 'Enter member handle'}
        notFoundNode={notFoundNode}
        resetOnSelect
        loading={isLoading}
        error={isError}
        onSelectedItemChange={handleSelect}
        helperText={isError ? 'Something went wrong' : ''}
        onInputValueChange={(val) => {
          setIsError(false)
          setIsLoading(true)
          debounceFetchMembers.current(val, selectedMembers)
        }}
      />
      <MemberBadgesWrapper>
        {selectedMembers.length > 0 && <StyledSelectedText variant="t200-strong">Selected: </StyledSelectedText>}
        {selectedMembers.map(({ id, handle, avatarUri }) => (
          <StyledMemberBadge
            key={id}
            handle={handle}
            avatarUri={avatarUri}
            onDeleteClick={() => handleDeleteClick(id)}
          />
        ))}
      </MemberBadgesWrapper>
    </div>
  )
}

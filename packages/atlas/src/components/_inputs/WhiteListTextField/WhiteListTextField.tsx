import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import React, { useRef, useState } from 'react'

import {
  BasicMembershipFieldsFragment,
  GetMembershipsDocument,
  GetMembershipsQuery,
  GetMembershipsQueryVariables,
} from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { SvgActionCancel } from '@/components/_icons'
import { useRawAssetResolver } from '@/providers/assets'
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
  const resolveAsset = useRawAssetResolver()

  const getAvatarUri = (avatar?: BasicMembershipFieldsFragment['metadata']['avatar']) => {
    if (avatar?.__typename === 'AvatarUri') {
      return avatar.avatarUri
    }
    if (avatar?.__typename === 'AvatarObject' && avatar.avatarObject?.id) {
      return resolveAsset(avatar.avatarObject?.id)?.url
    }
  }

  const debounceFetchMembers = useRef(
    debouncePromise(async (val?: string) => {
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

        const members = memberships.map(({ handle, id, metadata: { avatar } }) => ({
          handle,
          avatarUri: getAvatarUri(avatar),
          id,
        }))
        setMembers(members)
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
    setSelectedMembers((prevItems) => [{ id: item.id, avatarUri: item.avatarUri, handle: item.handle }, ...prevItems])
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

  const selectedMembersLookup = selectedMembers ? createLookup(selectedMembers) : {}

  return (
    <div>
      <TextFieldWithDropdown<Member>
        items={dropdownItems.filter((member) => !selectedMembersLookup[member.id])}
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
          debounceFetchMembers.current(val)
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

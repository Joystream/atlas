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
import { useMemberAvatar } from '@/providers/assets'
import { createLookup } from '@/utils/data'
import { SentryLogger } from '@/utils/logs'

import { MemberBadgesWrapper, StyledMemberBadge, StyledSelectedText } from './MemberComboBox.styles'

import { ComboBox } from '../ComboBox'

type MemberComboBoxProps = {
  selectedMembers: BasicMembershipFieldsFragment[]
  setSelectedMembers: React.Dispatch<React.SetStateAction<BasicMembershipFieldsFragment[]>>
  className?: string
}

export const MemberComboBox: React.FC<MemberComboBoxProps> = ({ selectedMembers, setSelectedMembers, className }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState<BasicMembershipFieldsFragment[]>([])
  const client = useApolloClient()
  const [isError, setIsError] = useState(false)

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

        setMembers(memberships)
      } catch (error) {
        SentryLogger.error('Failed to fetch memberships', 'WhiteListTextField', error)
        setIsError(true)
      }
    }, 500)
  )

  const handleSelect = (item?: BasicMembershipFieldsFragment) => {
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

  const selectedMembersLookup = selectedMembers ? createLookup(selectedMembers) : {}

  const dropdownItems = members
    .map((member) => {
      return {
        ...member,
        nodeStart: <AvatarWithResolvedAsset member={member} />,
        label: member.handle,
      }
    })
    .filter((member) => !selectedMembersLookup[member.id])

  const notFoundNode = {
    label: `We couldn't find this member. Please check if spelling is correct.`,
    nodeStart: <SvgActionCancel />,
  }

  return (
    <div className={className}>
      <ComboBox<BasicMembershipFieldsFragment>
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
          debounceFetchMembers.current(val)
        }}
      />
      <MemberBadgesWrapper>
        {selectedMembers.length > 0 && <StyledSelectedText variant="t200-strong">Selected: </StyledSelectedText>}
        {selectedMembers.map((member) => (
          <MemberBadgeWithResolvedAsset
            key={member.id}
            member={member}
            onDeleteClick={() => handleDeleteClick(member.id)}
          />
        ))}
      </MemberBadgesWrapper>
    </div>
  )
}

type AvatarWithResolvedAssetProps = {
  member: BasicMembershipFieldsFragment
}

const AvatarWithResolvedAsset: React.FC<AvatarWithResolvedAssetProps> = ({ member }) => {
  const { url, isLoadingAsset } = useMemberAvatar(member)
  return <Avatar assetUrl={url} loading={isLoadingAsset} />
}

type MemberBadgeWithResolvedAssetProps = {
  member: BasicMembershipFieldsFragment
  onDeleteClick: () => void
}

const MemberBadgeWithResolvedAsset: React.FC<MemberBadgeWithResolvedAssetProps> = ({ member, onDeleteClick }) => {
  const { url, isLoadingAsset } = useMemberAvatar(member)
  return (
    <StyledMemberBadge
      handle={member.handle}
      onDeleteClick={onDeleteClick}
      avatarUri={url}
      isLoadingAvatar={isLoadingAsset}
    />
  )
}

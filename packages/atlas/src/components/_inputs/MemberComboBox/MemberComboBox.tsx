import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import { FC, useRef, useState } from 'react'

import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import {
  GetMembershipsDocument,
  GetMembershipsQuery,
  GetMembershipsQueryVariables,
} from '@/api/queries/__generated__/memberships.generated'
import { SvgActionCancel } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { createLookup } from '@/utils/data'
import { SentryLogger } from '@/utils/logs'

import { MemberBadgesWrapper, StyledOutputPill } from './MemberComboBox.styles'

import { ComboBox, ComboBoxProps } from '../ComboBox'

type MemberComboBoxProps = {
  selectedMembers: BasicMembershipFieldsFragment[]
  className?: string
  onSelectMember?: (member: BasicMembershipFieldsFragment) => void
  onRemoveMember?: (memberId: string) => void
  disabled?: boolean
  error?: boolean
} & Pick<ComboBoxProps, 'onBlur'>

export const MemberComboBox: FC<MemberComboBoxProps> = ({
  selectedMembers,
  className,
  onSelectMember,
  onRemoveMember,
  disabled,
  error,
  onBlur,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState<BasicMembershipFieldsFragment[]>([])
  const client = useApolloClient()
  const [isError, setIsError] = useState(false)
  const [focusedElement, setFocusedElement] = useState<number | null>(null)

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
    onSelectMember?.(item)
    setMembers([])
  }

  const handleDeleteClick = (memberId: string, id?: number) => {
    if (memberId) {
      onRemoveMember?.(memberId)
    }
    if (id) {
      setFocusedElement(id === 0 ? null : id - 1)
    }
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
        disabled={disabled}
        placeholder={selectedMembers.length ? 'Enter another member handle' : 'Enter member handle'}
        notFoundNode={notFoundNode}
        resetOnSelect
        processing={isLoading}
        error={isError || error}
        onSelectedItemChange={handleSelect}
        onInputValueChange={(val) => {
          setIsError(false)
          setIsLoading(true)
          debounceFetchMembers.current(val)
        }}
        onBlur={onBlur}
      />
      <MemberBadgesWrapper>
        {selectedMembers.map((member, idx) => (
          <StyledOutputPillWithResolvedAsset
            key={member.id}
            member={member}
            onDeleteClick={() => handleDeleteClick(member.id)}
            onKeyPress={() => handleDeleteClick(member.id, idx)}
            focused={idx === focusedElement}
          />
        ))}
      </MemberBadgesWrapper>
    </div>
  )
}

type AvatarWithResolvedAssetProps = {
  member: BasicMembershipFieldsFragment
}

const AvatarWithResolvedAsset: FC<AvatarWithResolvedAssetProps> = ({ member }) => {
  const { urls, isLoadingAsset } = getMemberAvatar(member)
  return <Avatar size={32} assetUrl={urls} loading={isLoadingAsset} />
}

type StyledOutputPillWithResolvedAssetProps = {
  member: BasicMembershipFieldsFragment
  onDeleteClick: () => void
  onKeyPress: () => void
  focused: boolean
}

const StyledOutputPillWithResolvedAsset: FC<StyledOutputPillWithResolvedAssetProps> = ({
  member,
  onDeleteClick,
  onKeyPress,
  focused,
}) => {
  const { urls, isLoadingAsset } = getMemberAvatar(member)
  return (
    <StyledOutputPill
      handle={member.handle}
      onDeleteClick={onDeleteClick}
      avatarUri={urls}
      isLoadingAvatar={isLoadingAsset}
      withAvatar
      onKeyPress={onKeyPress}
      focused={focused}
    />
  )
}

import { AccountBar, Text } from '@/shared/components'
import React from 'react'
import { Membership } from '../StudioView'
import { Underline, StyledDialog, DialogSubtitle } from './SelectMemberDialog.style'

type SelectMemberDialogProps = {
  memberships: Membership[]
  onExit?: () => void
  showDialog?: boolean
  onSelectMember?: (member: Membership) => void
  onAddNewMember?: () => void
}

const SelectMemberDialog: React.FC<SelectMemberDialogProps> = ({
  memberships,
  onExit,
  showDialog,
  onSelectMember,
  onAddNewMember,
}) => {
  return (
    <StyledDialog showDialog={showDialog} onExitClick={onExit}>
      <Text variant="h4">Select Membership</Text>
      <DialogSubtitle variant="body2">Select your membership account</DialogSubtitle>
      <Underline />
      <AccountBar blank name="New Member" secondary="Create New Member" onClick={onAddNewMember} />
      {memberships.map((member) => (
        <AccountBar
          avatarUrl={member.avatarUri}
          name={member.handle}
          onClick={() => onSelectMember?.(member)}
          key={member.id}
        />
      ))}
    </StyledDialog>
  )
}

export default SelectMemberDialog

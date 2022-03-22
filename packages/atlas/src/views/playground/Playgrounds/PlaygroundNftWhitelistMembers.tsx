import React, { useState } from 'react'

import { BasicMembershipFieldsFragment } from '@/api/queries'
import { MemberComboBox } from '@/components/_inputs/MemberComboBox'

export const PlaygroundNftWhitelistMembers = () => {
  const [selectedMembers, setSelectedMembers] = useState<BasicMembershipFieldsFragment[]>([])
  return <MemberComboBox selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers} />
}

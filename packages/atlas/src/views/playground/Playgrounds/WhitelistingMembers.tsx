import React, { useState } from 'react'

import { BasicMembershipFieldsFragment } from '@/api/queries'
import { WhiteListTextField } from '@/components/_inputs/WhiteListTextField'

export const WhitelistingMembers = () => {
  const [selectedMembers, setSelectedMembers] = useState<BasicMembershipFieldsFragment[]>([])
  return <WhiteListTextField selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers} />
}

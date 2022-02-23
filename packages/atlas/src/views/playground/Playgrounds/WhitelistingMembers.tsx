import React, { useState } from 'react'

import { WhiteListTextField } from '@/components/_inputs/WhiteListTextField'

type Member = {
  id: string
  handle?: string | null
  avatarUri?: string | null
}

export const WhitelistingMembers = () => {
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
  return <WhiteListTextField selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers} />
}

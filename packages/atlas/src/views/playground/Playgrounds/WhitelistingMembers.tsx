import React, { useState } from 'react'

import { TextFieldWithDropdown } from '@/components/_inputs/TextField/TextFieldWithDropdown'

export const WhitelistingMembers = () => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const members = ['Klaudiusz', 'Loic', 'Diego', 'Rafal', 'Bartosz']
  return (
    <div>
      <TextFieldWithDropdown
        items={members}
        resetOnSelect
        onSelect={(item) => item && setSelectedMembers([item, ...selectedMembers])}
      />
      {selectedMembers.map((member, idx) => (
        <div key={idx}>{member}</div>
      ))}
    </div>
  )
}

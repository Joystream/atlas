import styled from '@emotion/styled'
import React from 'react'

import { MemberDropdown } from '@/components/_overlays/MemberDropdown'

export const PlaygroundMemberDropdown = () => {
  return (
    <Container>
      <div>
        <MemberDropdown isActive />
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: min-content min-content;
  gap: 16px;
`

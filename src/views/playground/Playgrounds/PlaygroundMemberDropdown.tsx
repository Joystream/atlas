import styled from '@emotion/styled'
import React from 'react'

import { MemberDropdown } from '@/components/_overlays/MemberDropdown'
import { VideoWorkspaceProvider } from '@/providers/videoWorkspace'

export const PlaygroundMemberDropdown = () => {
  return (
    <VideoWorkspaceProvider>
      <Container>
        <MemberDropdown isActive />
      </Container>
    </VideoWorkspaceProvider>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: min-content min-content;
  gap: 16px;
`

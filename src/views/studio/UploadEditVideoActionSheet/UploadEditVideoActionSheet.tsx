import React, { useState } from 'react'

import styled from '@emotion/styled'
import { colors, sizes, zIndex } from '@/shared/theme'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopNavbar'
import { Button } from '@/shared/components'
import { useMatch, useNavigate } from 'react-router-dom'
import { studioRoutes } from '@/config/routes'

export const UploadEditVideoActionSheet: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false)
  const navigate = useNavigate()
  const uploadVideoMatch = useMatch({ path: `${studioRoutes.uploadVideo()}` })

  return (
    <Container role="dialog" minimize={!!uploadVideoMatch}>
      <Topbar>
        <TabsContainer>
          tab 1
          <Button variant="tertiary" onClick={() => {}}>
            +
          </Button>
        </TabsContainer>
        <ButtonsContainer>
          <Button
            variant="tertiary"
            onClick={() => {
              navigate('/studio')
            }}
          >
            -
          </Button>
          <Button
            variant="tertiary"
            onClick={() => {
              navigate('/studio')
            }}
          >
            x
          </Button>
        </ButtonsContainer>
      </Topbar>
    </Container>
  )
}

type ContainerProps = { minimize?: boolean }
const Container = styled.div<ContainerProps>`
  --upload-video-action-sheet-bar-height: ${sizes(14)};
  ${({ minimize }) => !minimize && `transform: translateY(calc(100% - var(--upload-video-action-sheet-bar-height)))`};

  position: fixed;
  z-index: ${zIndex.nearOverlay};
  top: ${TOP_NAVBAR_HEIGHT}px;
  left: var(--sidenav-collapsed-width);
  right: 0;
  height: calc(100vh - ${TOP_NAVBAR_HEIGHT}px);

  background-color: ${colors.gray[900]};
  /* padding: 0 var(--global-horizontal-padding); */
  overflow: auto;
`

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  height: var(--upload-video-action-sheet-bar-height);
  border-bottom: solid 1px ${colors.gray[700]};
`

const TabsContainer = styled.div``

const ButtonsContainer = styled.div`
  border-left: solid 1px ${colors.gray[700]};
`

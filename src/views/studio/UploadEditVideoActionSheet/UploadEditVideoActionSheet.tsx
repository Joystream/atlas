import React, { useState } from 'react'

import styled from '@emotion/styled'
import { colors, sizes, transitions, zIndex } from '@/shared/theme'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopNavbar'
import { Button } from '@/shared/components'
import { useMatch, useNavigate } from 'react-router-dom'
import { studioRoutes } from '@/config/routes'
import { animated, config, useSpring, useTransition } from 'react-spring'
import useMeasure from 'react-use-measure'

export const UploadEditVideoActionSheetBarHeight = sizes(14, true)

export type SheetState = 'closed' | 'open' | 'minimized'
type UploadEditVideoActionSheetProps = {
  // setSheetState?: (sheetState: SheetState) => void
  // sheetState: SheetState
}
export const UploadEditVideoActionSheet: React.FC<UploadEditVideoActionSheetProps> = () => {
  const [sheetState, setSheetState] = useState<SheetState>('minimized')
  const navigate = useNavigate()
  const uploadVideoMatch = useMatch({ path: `${studioRoutes.uploadVideo()}` })
  const [ref, bounds] = useMeasure()
  const { ...props } = useSpring({
    duration: transitions.timings.sharp,
    transform:
      sheetState === 'open'
        ? `translateY(0)`
        : sheetState === 'closed'
        ? `translateY(${bounds.height}px)`
        : `translateY(${bounds.height ? bounds.height - UploadEditVideoActionSheetBarHeight + 1 : 10000}px)`,
  })
  console.log({ uploadVideoMatch, sheetState, vw: bounds.height - UploadEditVideoActionSheetBarHeight })

  return (
    <Container ref={ref} role="dialog" style={{ ...props }}>
      <Topbar>
        <TabsContainer>
          tab 1
          <Button
            variant="tertiary"
            onClick={() => {
              navigate('/studio')
              setSheetState?.('open')
              console.log('open')
            }}
          >
            +
          </Button>
        </TabsContainer>
        <ButtonsContainer>
          <Button
            variant="tertiary"
            onClick={() => {
              if (sheetState === 'open') {
                setSheetState?.('minimized')
                navigate('/studio')
                console.log('minimize')
              } else if (sheetState === 'minimized') {
                setSheetState?.('open')
                navigate('/studio/upload')
                console.log('minimize')
              }
            }}
          >
            -
          </Button>
          <Button
            variant="tertiary"
            onClick={() => {
              navigate('/studio')
              setSheetState?.('closed')
              console.log('close')
            }}
          >
            x
          </Button>
        </ButtonsContainer>
      </Topbar>
    </Container>
  )
}

const getViewportHeight = (v: number) => {
  const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  return (v * h) / 100
}

type ContainerProps = { minimize?: boolean }
const Container = styled(animated.div)`
  --upload-video-action-sheet-bar-height: ${UploadEditVideoActionSheetBarHeight}px;
  transform: translateY(100%);
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

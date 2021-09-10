import styled from '@emotion/styled'
import React from 'react'
import { Route, Routes } from 'react-router'
import { Link } from 'react-router-dom'

import { ConnectionStatusManager } from '@/providers/connectionStatus'
import { DialogProvider } from '@/providers/dialogs'
import { ActiveUserProvider } from '@/providers/user'
import { colors } from '@/shared/theme'

import {
  Animations,
  AutomaticCrop,
  Dialogs,
  FileHashing,
  GridTesting,
  ImageDownsizing,
  OrionTesting,
  PlaygroundBreakpoints,
  PlaygroundCommonStore,
  PlaygroundConnectionState,
  PlaygroundDrafts,
  PlaygroundMemberChannel,
  PlaygroundValidationForm,
  UploadFiles,
  VideoMetaData,
} from './Playgrounds'

const playgroundRoutes = [
  { path: 'animations', element: <Animations />, name: 'Animations' },
  { path: 'validation-form', element: <PlaygroundValidationForm />, name: 'Validation Form' },
  { path: 'drafts', element: <PlaygroundDrafts />, name: 'Drafts' },
  { path: 'video-metadata', element: <VideoMetaData />, name: 'Video Metadata' },
  { path: 'upload-files', element: <UploadFiles />, name: 'Upload Files' },
  { path: 'member-active-channel', element: <PlaygroundMemberChannel />, name: 'Active user/member/channel' },
  { path: 'file-hashing', element: <FileHashing />, name: 'File hashing' },
  { path: 'connection-state', element: <PlaygroundConnectionState />, name: 'Connection state' },
  { path: 'image-downsizing', element: <ImageDownsizing />, name: 'Image downsizing' },
  { path: 'automatic-crop', element: <AutomaticCrop />, name: 'Automatic crop' },
  { path: 'dialogs', element: <Dialogs />, name: 'Dialogs' },
  { path: 'store', element: <PlaygroundCommonStore />, name: 'Store' },
  { path: 'orion-testing', element: <OrionTesting />, name: 'Orion testing' },
  { path: 'grid', element: <GridTesting />, name: 'Grid testing' },
  { path: 'breakpoints', element: <PlaygroundBreakpoints />, name: 'Breakpoints' },
]

const PlaygroundLayout = () => {
  return (
    <ActiveUserProvider>
      <DialogProvider>
        <Container>
          <NavContainer>
            {playgroundRoutes.map((route) => (
              <Link key={route.path} to={route.path}>
                {route.name}
              </Link>
            ))}
          </NavContainer>
          <ContentContainer>
            <Routes>
              {playgroundRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </ContentContainer>
        </Container>
        <ConnectionStatusManager />
      </DialogProvider>
    </ActiveUserProvider>
  )
}

const Container = styled.div`
  padding: 40px;
  display: flex;
`

const NavContainer = styled.div`
  max-width: 240px;
  display: flex;
  flex-direction: column;
  font-size: 20px;

  a {
    color: ${colors.gray[50]};
    margin-bottom: 20px;
  }
`

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 30px;
  overflow: hidden;
`

export default PlaygroundLayout

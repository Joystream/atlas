import styled from '@emotion/styled'
import React from 'react'
import { Route, Routes } from 'react-router'
import { Link } from 'react-router-dom'

import {
  ActiveUserProvider,
  ConnectionStatusProvider,
  DialogProvider,
  DraftsProvider,
  Snackbars,
  UploadManagerProvider,
} from '@/hooks'
import { colors } from '@/shared/theme'

import {
  AutomaticCrop,
  Dialogs,
  FileHashing,
  ImageDownsizing,
  PlaygroundConnectionState,
  PlaygroundDrafts,
  PlaygroundMemberChannel,
  PlaygroundValidationForm,
  UploadFiles,
  VideoMetaData,
} from './Playgrounds'

const playgroundRoutes = [
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
]

export const PlaygroundLayout = () => {
  return (
    <ActiveUserProvider>
      <DialogProvider>
        <UploadManagerProvider>
          <ConnectionStatusProvider>
            <DraftsProvider>
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
                  <Snackbars />
                </ContentContainer>
              </Container>
            </DraftsProvider>
          </ConnectionStatusProvider>
        </UploadManagerProvider>
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
  display: flex;
  flex-direction: column;
  padding-left: 30px;
  overflow: hidden;
`

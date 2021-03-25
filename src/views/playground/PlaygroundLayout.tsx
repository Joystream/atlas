import React from 'react'
import styled from '@emotion/styled'
import { Text } from '@/shared/components'
import Link from '@/components/Link'
import { DraftsProvider, UploadingFilesDataProvider, ActiveUserProvider } from '@/hooks'
import { Route, Routes } from 'react-router'
import {
  PlaygroundDrafts,
  PlaygroundMemberChannel,
  PlaygroundUploadingFilesData,
  PlaygroundValidationForm,
  VideoMetaData,
} from './Playgrounds'

const playgroundRoutes = [
  { path: 'validation-form', element: <PlaygroundValidationForm />, name: 'Validation Form' },
  { path: 'drafts', element: <PlaygroundDrafts />, name: 'Drafts' },
  { path: 'video-metadata', element: <VideoMetaData />, name: 'Video Metadata' },
  { path: 'uploading-files-data', element: <PlaygroundUploadingFilesData />, name: 'Uploading Files Data' },
  { path: 'member-active-channel', element: <PlaygroundMemberChannel />, name: 'Active user/member/channel' },
]

export const PlaygroundLayout = () => {
  return (
    <DraftsProvider>
      <UploadingFilesDataProvider>
        <ActiveUserProvider>
          <Container>
            <Text variant="h2">Internal testing view</Text>
            <LinksContainer>
              {playgroundRoutes.map((route) => (
                <Link key={route.path} to={route.path}>
                  {route.name}
                </Link>
              ))}
            </LinksContainer>

            <Routes>
              {playgroundRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Container>
        </ActiveUserProvider>
      </UploadingFilesDataProvider>
    </DraftsProvider>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const LinksContainer = styled.div`
  display: flex;
  gap: 20px;
  a {
    font-size: 16px;
  }
`

export default PlaygroundLayout

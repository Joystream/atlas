import React from 'react'
import {
  AssetsGroupBarUploadContainer,
  ProgressBar,
  Thumbnail,
  AssetsInfoContainer,
  UploadInfoContainer,
} from './AssetsGroupUploadBar.style'
import { Icon, Text, Button } from '@/shared/components'

const AssetsGroupBarUpload = () => {
  return (
    <>
      <AssetsGroupBarUploadContainer>
        <ProgressBar />
        <Thumbnail>
          <Icon name="play" />
        </Thumbnail>
        <AssetsInfoContainer>
          <Text variant="h6">Lost in the woods? EP2</Text>
          <Text variant="body2">2 assets</Text>
        </AssetsInfoContainer>
        <UploadInfoContainer>
          <Text variant="subtitle2">Uploaded (60%)</Text>
          <Button variant="tertiary" icon="chevron-down" size="large" />
        </UploadInfoContainer>
      </AssetsGroupBarUploadContainer>
    </>
  )
}

export default AssetsGroupBarUpload

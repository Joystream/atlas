import React, { useState } from 'react'
import {
  Container,
  AssetsGroupBarUploadContainer,
  ProgressBar,
  Thumbnail,
  AssetsInfoContainer,
  UploadInfoContainer,
  AssetsDrawerContainer,
} from './AssetsGroupUploadBar.style'
import { AssetLine } from './AssetLine'
import { Icon, Text } from '@/shared/components'
import { DrawerButton } from '@/components/PublishingTopbar/PublishingTopbar.style'

type AssetType = 'avatar' | 'cover' | 'thumbnail' | 'video'
export type Asset = {
  type: AssetType
  progress: number
  status: 'uploading' | 'pending' | 'failed' | 'completed'
  width: number
  height: number
  size: number
  statusMessage?: string
}

type UploadDataType = 'channel' | 'video'
export type UploadData = {
  type: UploadDataType
  title?: string
  files: Asset[]
}

type AssetsGroupBarUploadProps = {
  uploadData: UploadData
}

const AssetsGroupBarUpload: React.FC<AssetsGroupBarUploadProps> = ({ uploadData: { type, title, files } }) => {
  const [isAssetsDrawerActive, setAssetsDrawerActive] = useState(false)

  const isChannelType = type === 'channel'
  const isPending = files.every((file) => file.status === 'pending')
  const hasErrorNumber = files.filter((file) => file.status === 'failed').length

  const allAssetsSize = files.reduce((acc, file) => (acc = acc + file.size), 0)
  const alreadyUploadedSize = files.reduce((acc, file) => (acc = acc + (file.size * file.progress) / 100), 0)
  const masterProgress = Math.floor((alreadyUploadedSize / allAssetsSize) * 100)

  const assetsGroupIconName = hasErrorNumber ? 'error' : isChannelType ? 'my-channel' : 'play'
  const assetsGroupTitleText = isChannelType ? 'Channel assets' : title
  const assetsGroupNumberText = `${files.length} asset${files.length > 1 ? 's' : ''}`
  const assetsGroupInfoText = isPending
    ? 'Waiting for upload...'
    : hasErrorNumber
    ? `(${hasErrorNumber}) Asset upload failed`
    : `Uploaded (${masterProgress}%)`

  return (
    <Container>
      <AssetsGroupBarUploadContainer>
        <ProgressBar progress={masterProgress} />
        <Thumbnail>
          <Icon name={assetsGroupIconName} />
        </Thumbnail>
        <AssetsInfoContainer>
          <Text variant="h6">{assetsGroupTitleText}</Text>
          <Text variant="body2">{assetsGroupNumberText}</Text>
        </AssetsInfoContainer>
        <UploadInfoContainer>
          <Text variant="subtitle2">{assetsGroupInfoText}</Text>
          <DrawerButton
            isActive={isAssetsDrawerActive}
            variant="tertiary"
            icon="chevron-down"
            size="large"
            onClick={() => setAssetsDrawerActive(!isAssetsDrawerActive)}
          />
        </UploadInfoContainer>
      </AssetsGroupBarUploadContainer>
      <AssetsDrawerContainer isActive={isAssetsDrawerActive}>
        {files.map((file, idx) => (
          <AssetLine key={file.type + idx} asset={file} isLast={files.length === idx + 1} />
        ))}
      </AssetsDrawerContainer>
    </Container>
  )
}

export default AssetsGroupBarUpload

import React, { useState } from 'react'
import { formatBytes } from '@/utils/size'
import {
  Container,
  AssetsGroupBarUploadContainer,
  ProgressBar,
  Thumbnail,
  AssetsInfoContainer,
  UploadInfoContainer,
  AssetsDrawerContainer,
  FileLineContainer,
  FileLinePoint,
  FileLineLastPoint,
  FileStatusContainer,
  FileInfoContainer,
  FileInfoType,
  StatusMessage,
} from './AssetsGroupUploadBar.style'
import { Icon, Text, Button, CircularProgressbar } from '@/shared/components'
import { DrawerButton } from '@/components/PublishingTopbar/PublishingTopbar.style'

export type AssetType = 'avatar' | 'cover' | 'thumbnail' | 'video'
export type Asset = {
  type: AssetType
  progress: number
  status: 'uploading' | 'pending' | 'failed' | 'completed'
  dimension: string
  size: number
  statusMessage?: string
}

export type UploadDataType = 'channel' | 'video'
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
          <FileLine key={file.type + idx} asset={file} isLast={files.length === idx + 1} />
        ))}
      </AssetsDrawerContainer>
    </Container>
  )
}

type FileLineProps = {
  isLast?: boolean
  asset: Asset
}

const FileLine: React.FC<FileLineProps> = ({ isLast = false, asset }) => {
  const isVideo = asset.type === 'video'
  const fileTypeText = isVideo ? 'Video file' : `${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} image`
  let fileStatus
  let fileStatusMessage = ''
  switch (asset.status) {
    case 'uploading':
      fileStatus = <CircularProgressbar value={asset.progress} />
      break
    case 'pending':
      fileStatus = <CircularProgressbar value={0} />
      break
    case 'failed':
      fileStatus = <Icon name="error" />
      fileStatusMessage = asset.statusMessage || ''
      break
    case 'completed':
      fileStatus = <Icon name="success" />
      break
    default:
      fileStatus = <CircularProgressbar value={asset.progress} />
  }
  return (
    <FileLineContainer isLast={isLast}>
      {isLast ? <FileLineLastPoint /> : <FileLinePoint />}
      <FileStatusContainer>{fileStatus}</FileStatusContainer>
      <FileInfoContainer>
        <FileInfoType>
          <Icon name={isVideo ? 'video-file' : 'image-file'} />
          <Text variant="body2">{fileTypeText}</Text>
        </FileInfoType>
        <Text variant="body2">1920x1080</Text>
        <Text>{formatBytes(asset.size)}</Text>
      </FileInfoContainer>
      <StatusMessage variant="subtitle2">{fileStatusMessage}</StatusMessage>
    </FileLineContainer>
  )
}

export default AssetsGroupBarUpload

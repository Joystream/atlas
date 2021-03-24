import React, { useState } from 'react'
import { formatBytes } from '@/utils/number'
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

  const hasError = files.filter((file) => file.status === 'failed').length
  const isChannelType = type === 'channel'
  const filesSize = files.reduce((acc, file) => (acc = acc + file.size), 0)
  const uploadedSize = files.reduce((acc, file) => (acc = acc + (file.size * file.progress) / 100), 0)
  const masterProgress = Math.floor((uploadedSize / filesSize) * 100)

  return (
    <Container>
      <AssetsGroupBarUploadContainer>
        <ProgressBar progress={masterProgress} />
        <Thumbnail>
          <Icon name={hasError ? 'error' : isChannelType ? 'my-channel' : 'play'} />
        </Thumbnail>
        <AssetsInfoContainer>
          <Text variant="h6">{isChannelType ? 'Channel assets' : title}</Text>
          <Text variant="body2">
            {files.length} asset{files.length > 1 ? 's' : ''}
          </Text>
        </AssetsInfoContainer>
        <UploadInfoContainer>
          <Text variant="subtitle2">
            {hasError ? `(${hasError}) Asset upload failed` : `Uploaded (${masterProgress}%)`}
          </Text>
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
  switch (asset.status) {
    case 'uploading':
      fileStatus = <CircularProgressbar value={asset.progress} />
      break
    case 'pending':
      fileStatus = <CircularProgressbar value={0} />
      break
    case 'failed':
      fileStatus = <Icon name="error" />
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
    </FileLineContainer>
  )
}

export default AssetsGroupBarUpload

import React from 'react'
import { formatBytes } from '@/utils/size'
import {
  FileLineContainer,
  FileLinePoint,
  FileLineLastPoint,
  FileStatusContainer,
  FileInfoContainer,
  FileInfoType,
  StatusMessage,
} from './AssetsGroupUploadBar.style'
import { Icon, Text, CircularProgressbar } from '@/shared/components'
import { Asset } from './AssetsGroupUploadBar'

type AssetLineProps = {
  isLast?: boolean
  asset: Asset
}

export const AssetLine: React.FC<AssetLineProps> = ({ isLast = false, asset }) => {
  const isVideo = asset.type === 'video'
  const fileTypeText = isVideo ? 'Video file' : `${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} image`
  const resolution = `${asset.width}x${asset.height}`
  const size = formatBytes(asset.size)

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
        <Text variant="body2">{resolution}</Text>
        <Text>{size}</Text>
      </FileInfoContainer>
      <StatusMessage variant="subtitle2">{fileStatusMessage}</StatusMessage>
    </FileLineContainer>
  )
}

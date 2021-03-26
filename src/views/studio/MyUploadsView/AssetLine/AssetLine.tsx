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
} from './AssetLine.style'
import { Icon, Text, CircularProgressbar } from '@/shared/components'
import { Asset } from '../AssetsGroupUploadBar/AssetsGroupUploadBar'

type AssetLineProps = {
  isLast?: boolean
  asset: Asset
}

const AssetLine: React.FC<AssetLineProps> = ({ isLast = false, asset }) => {
  const isVideo = asset.type === 'video'
  const fileInfoIcon = isVideo ? 'video-file' : 'image-file'
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
      fileStatus = <Icon name="error-second" />
      break
    case 'completed':
      fileStatus = <Icon name="success" />
      break
    case 'reconnecting':
      fileStatus = <Icon name="error-second" />
      fileStatusMessage = 'Reconnecting...'
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
          <Icon name={fileInfoIcon} />
          <Text variant="body2">{fileTypeText}</Text>
        </FileInfoType>
        <Text variant="body2">{resolution}</Text>
        <Text>{size}</Text>
      </FileInfoContainer>
      <StatusMessage variant="subtitle2">{fileStatusMessage}</StatusMessage>
    </FileLineContainer>
  )
}

export default AssetLine

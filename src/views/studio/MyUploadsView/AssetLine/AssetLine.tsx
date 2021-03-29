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
  ProgressbarContainer,
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
  const fileStatusMessage = asset.status === 'reconnecting' ? 'Reconnecting...' : ''

  const resolution = `${asset.width}x${asset.height}`
  const size = formatBytes(asset.size)

  const renderStatusIndicator = (asset: Asset) => {
    switch (asset.status) {
      case 'pending':
        return (
          <ProgressbarContainer>
            <CircularProgressbar value={0} />
          </ProgressbarContainer>
        )
      case 'failed':
        return <Icon name="error-second" />
      case 'completed':
        return <Icon name="success" />
      case 'reconnecting':
        return <Icon name="error-second" />
      default:
        return (
          <ProgressbarContainer>
            <CircularProgressbar value={asset.progress} />
          </ProgressbarContainer>
        )
    }
  }

  return (
    <FileLineContainer isLast={isLast}>
      {isLast ? <FileLineLastPoint /> : <FileLinePoint />}
      <FileStatusContainer>{renderStatusIndicator(asset)}</FileStatusContainer>
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

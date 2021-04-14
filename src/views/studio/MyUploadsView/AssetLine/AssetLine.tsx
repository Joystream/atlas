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
import { Text, CircularProgressbar } from '@/shared/components'
import { Asset } from '../AssetsGroupUploadBar/AssetsGroupUploadBar'
import { SvgAlertError, SvgAlertSuccess, SvgGlyphFileImage, SvgGlyphFileVideo } from '@/shared/icons'

type AssetLineProps = {
  isLast?: boolean
  asset: Asset
}

const AssetLine: React.FC<AssetLineProps> = ({ isLast = false, asset }) => {
  const isVideo = asset.type === 'video'

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
      case 'completed':
        return <SvgAlertSuccess />
      case 'failed':
        return <SvgAlertError />
      case 'reconnecting':
        return <SvgAlertError />
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
          {isVideo ? <SvgGlyphFileVideo /> : <SvgGlyphFileImage />}
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

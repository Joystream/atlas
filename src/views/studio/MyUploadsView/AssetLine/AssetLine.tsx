import React from 'react'
import { formatBytes } from '@/utils/size'
import { LiaisonJudgement } from '@/api/queries/__generated__/baseTypes.generated'
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
import { UploadData } from '../AssetsGroupUploadBar/AssetsGroupUploadBar'
import { Text, CircularProgressbar } from '@/shared/components'
import { SvgAlertError, SvgAlertSuccess, SvgGlyphFileImage, SvgGlyphFileVideo } from '@/shared/icons'

type AssetLineProps = {
  isLast?: boolean
  asset: UploadData
}

const AssetLine: React.FC<AssetLineProps> = ({ isLast = false, asset }) => {
  const isVideo = asset.type === 'video'

  const fileTypeText = isVideo ? 'Video file' : `${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} image`
  const fileStatusMessage = asset.lastStatus === 'error' ? 'Reconnecting...' : ''

  const resolution =
    asset.imageCropData?.width && asset.imageCropData.height
      ? `${Math.floor(asset.imageCropData.width)}x${Math.floor(asset.imageCropData.height)}`
      : ''
  const size = formatBytes(asset.size)

  const renderStatusIndicator = (asset: UploadData) => {
    if (asset.lastStatus === 'completed') {
      return <SvgAlertSuccess />
    }
    if (asset.lastStatus === 'error') {
      return <SvgAlertError />
    }
    return (
      <ProgressbarContainer>
        <CircularProgressbar value={asset.progress} />
      </ProgressbarContainer>
    )
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

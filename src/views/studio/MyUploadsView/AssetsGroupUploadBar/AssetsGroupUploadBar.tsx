import React, { useState, useRef } from 'react'
import {
  Container,
  AssetsGroupUploadBarContainer,
  ProgressBar,
  Thumbnail,
  AssetsInfoContainer,
  UploadInfoContainer,
  AssetsDrawerContainer,
} from './AssetsGroupUploadBar.style'
import { AssetLine } from '../AssetLine'
import { Text, ExpandButton } from '@/shared/components'
import { SvgAlertError, SvgNavChannel, SvgOutlineVideo } from '@/shared/icons'

type AssetType = 'avatar' | 'cover' | 'thumbnail' | 'video'
type AssetStatus = 'completed' | 'uploading' | 'pending' | 'failed' | 'reconnecting'
export type Asset = {
  id: string
  type: AssetType
  progress: number
  status: AssetStatus
  width: number
  height: number
  size: number
}

type UploadDataType = 'channel' | 'video'
export type UploadData = {
  type: UploadDataType
  title?: string
  files: Asset[]
}

export type AssetsGroupBarUploadProps = {
  uploadData: UploadData
}

const AssetsGroupUploadBar: React.FC<AssetsGroupBarUploadProps> = ({ uploadData: { type, title, files } }) => {
  const [isAssetsDrawerActive, setAssetsDrawerActive] = useState(false)

  const drawer = useRef<HTMLDivElement>(null)

  const isChannelType = type === 'channel'
  const isPending = files.every((file) => file.status === 'pending')
  const hasErrorNumber = files.filter(({ status }) => status === 'failed' || status === 'reconnecting').length

  const allAssetsSize = files.reduce((acc, file) => acc + file.size, 0)
  const alreadyUploadedSize = files.reduce((acc, file) => acc + (file.progress / 100) * file.size, 0)
  const masterProgress = Math.floor((alreadyUploadedSize / allAssetsSize) * 100)

  const assetsGroupTitleText = isChannelType ? 'Channel assets' : title
  const assetsGroupNumberText = `${files.length} asset${files.length > 1 ? 's' : ''}`
  const assetsGroupInfoText = isPending
    ? 'Waiting for upload...'
    : hasErrorNumber
    ? `(${hasErrorNumber}) Asset${hasErrorNumber > 1 ? 's' : ''} upload failed`
    : `Uploaded (${masterProgress}%)`

  return (
    <Container>
      <AssetsGroupUploadBarContainer
        onClick={() => setAssetsDrawerActive(!isAssetsDrawerActive)}
        isActive={isAssetsDrawerActive}
      >
        <ProgressBar progress={masterProgress} />
        <Thumbnail>
          {hasErrorNumber ? <SvgAlertError /> : isChannelType ? <SvgNavChannel /> : <SvgOutlineVideo />}
        </Thumbnail>
        <AssetsInfoContainer>
          <Text variant="h6">{assetsGroupTitleText}</Text>
          <Text variant="body2">{assetsGroupNumberText}</Text>
        </AssetsInfoContainer>
        <UploadInfoContainer>
          <Text variant="subtitle2">{assetsGroupInfoText}</Text>
          <ExpandButton expanded={isAssetsDrawerActive} onClick={() => setAssetsDrawerActive(!isAssetsDrawerActive)} />
        </UploadInfoContainer>
      </AssetsGroupUploadBarContainer>
      <AssetsDrawerContainer isActive={isAssetsDrawerActive} ref={drawer} maxHeight={drawer?.current?.scrollHeight}>
        {files.map((file, idx) => (
          <AssetLine key={file.id} asset={file} isLast={files.length === idx + 1} />
        ))}
      </AssetsDrawerContainer>
    </Container>
  )
}

export default AssetsGroupUploadBar

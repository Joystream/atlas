import React, { useState, useRef } from 'react'
import { AssetUploadWithProgress } from '@/hooks/useUploadsManager/types'
import { LiaisonJudgement } from '@/api/queries/__generated__/baseTypes.generated'
import {
  Container,
  AssetsGroupUploadBarContainer,
  ProgressBar,
  Thumbnail,
  AssetsInfoContainer,
  UploadInfoContainer,
  AssetsDrawerContainer,
  StyledExpandButton,
} from './AssetsGroupUploadBar.style'
import { AssetLine } from '../AssetLine'
import { Text } from '@/shared/components'
import { SvgAlertError, SvgNavChannel, SvgOutlineVideo } from '@/shared/icons'

export type UploadData = {
  liaisonJudgement?: LiaisonJudgement
} & AssetUploadWithProgress

export type AssetsGroupBarUploadProps = {
  uploadData: UploadData[]
}

const AssetsGroupUploadBar: React.FC<AssetsGroupBarUploadProps> = ({ uploadData }) => {
  const [isAssetsDrawerActive, setAssetsDrawerActive] = useState(false)

  const drawer = useRef<HTMLDivElement>(null)

  const isChannelType = uploadData[0].parentObject.type === 'channel'

  const isPending = uploadData.every((file) => file.liaisonJudgement === LiaisonJudgement.Pending)
  const hasErrorNumber = uploadData.filter(({ lastStatus }) => lastStatus === 'error').length

  const allAssetsSize = uploadData.reduce((acc, file) => acc + file.size, 0)
  const alreadyUploadedSize = uploadData.reduce((acc, file) => acc + (file.progress / 100) * file.size, 0)
  const masterProgress = Math.floor((alreadyUploadedSize / allAssetsSize) * 100)

  // TODO add video title on video type assets
  const assetsGroupTitleText = isChannelType ? 'Channel assets' : 'Video title'
  const assetsGroupNumberText = `${uploadData.length} asset${uploadData.length > 1 ? 's' : ''}`

  const isCompleted = uploadData.every((item) => item.lastStatus === 'completed')
  const assetsGroupInfoText = hasErrorNumber
    ? `(${hasErrorNumber}) Asset${hasErrorNumber > 1 ? 's' : ''} upload failed`
    : isPending
    ? 'Pending'
    : isCompleted
    ? 'Completed'
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
          <StyledExpandButton
            expanded={isAssetsDrawerActive}
            onClick={() => setAssetsDrawerActive(!isAssetsDrawerActive)}
            size="large"
          />
        </UploadInfoContainer>
      </AssetsGroupUploadBarContainer>
      <AssetsDrawerContainer isActive={isAssetsDrawerActive} ref={drawer} maxHeight={drawer?.current?.scrollHeight}>
        {uploadData.map((file, idx) => (
          <AssetLine key={file.contentId} asset={file} isLast={uploadData.length === idx + 1} />
        ))}
      </AssetsDrawerContainer>
    </Container>
  )
}

export default AssetsGroupUploadBar

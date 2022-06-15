import { FC } from 'react'
import shallow from 'zustand/shallow'

import { EmptyFallback } from '@/components/EmptyFallback'
import { Button } from '@/components/_buttons/Button'
import { SvgActionUpload } from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUploadsStore } from '@/providers/uploadsManager/store'
import { AssetUpload } from '@/providers/uploadsManager/types'
import { useUser } from '@/providers/user'

import { StyledText, UploadsContainer } from './MyUploadsView.styles'
import { UploadStatusGroup } from './UploadStatusGroup'
import { UploadStatusGroupSkeletonLoader } from './UploadStatusGroup/UploadStatusGroupSkeletonLoader'

type GroupByParentObjectIdAcc = {
  [key: string]: AssetUpload[]
}

export const MyUploadsView: FC = () => {
  const lgMatch = useMediaMatch('lg')
  const { channelId } = useUser()

  const headTags = useHeadTags('My uploads')

  const channelUploads = useUploadsStore((state) => state.uploads.filter((asset) => asset.owner === channelId), shallow)
  const isSyncing = useUploadsStore((state) => state.isSyncing)

  // Grouping all assets by parent id (videos, channel)
  const groupedUploadsState = Object.values(
    channelUploads.reduce((acc: GroupByParentObjectIdAcc, asset) => {
      if (!asset) {
        return acc
      }
      const key = asset.parentObject.id
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(asset)
      return acc
    }, {})
  )

  const hasUploads = groupedUploadsState.length > 0
  const placeholderItems = Array.from({ length: 5 }).map((_, idx) => <UploadStatusGroupSkeletonLoader key={idx} />)

  return (
    <UploadsContainer>
      {headTags}
      <StyledText variant="h700">My uploads</StyledText>
      {isSyncing ? (
        placeholderItems
      ) : hasUploads ? (
        groupedUploadsState.map((files) => (
          <UploadStatusGroup size={lgMatch ? 'large' : 'compact'} key={files[0].parentObject.id} uploads={files} />
        ))
      ) : (
        <EmptyFallback
          verticalCentered
          title="No ongoing uploads"
          subtitle="You will see status of each ongoing upload here."
          button={
            <Button
              icon={<SvgActionUpload />}
              variant="secondary"
              size="large"
              to={absoluteRoutes.studio.videoWorkspace()}
            >
              Upload video
            </Button>
          }
        />
      )}
    </UploadsContainer>
  )
}

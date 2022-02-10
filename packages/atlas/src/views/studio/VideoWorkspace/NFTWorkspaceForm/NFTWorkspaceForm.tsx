import React, { useMemo, useState } from 'react'
import useMeasure from 'react-use-measure'

import { useVideo } from '@/api/hooks'
import { NftTile, NftTileProps } from '@/components/NftTile'
import { Step, StepProps, getStepVariant } from '@/components/Step'
import { Paragraph } from '@/components/_inputs/FileSelect/FileSelect.styles'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAsset } from '@/providers/assets'
import { useUser } from '@/providers/user'

import {
  NFTFormScrolling,
  NFTFormWrapper,
  NFTPreview,
  NFTWorkspaceFormWrapper,
  ScrollableWrapper,
  StepWrapper,
  StepperInnerWrapper,
  StepperWrapper,
  StyledActionBar,
  StyledChevron,
  Title,
} from './NFTWorkspaceForm.styles'

type NFTWorkspaceFormProps = {
  onGoBack: () => void
  isEdit?: boolean
  fee: number
  videoId: string
}

export const NFTWorkspaceForm: React.FC<NFTWorkspaceFormProps> = ({ onGoBack, isEdit, fee, videoId }) => {
  const { activeMembership } = useUser()
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [actionBarRef, actionBarBounds] = useMeasure()
  const mdMatch = useMediaMatch('md')
  const { video, loading: loadingVideo } = useVideo(videoId, { fetchPolicy: 'cache-only' })
  const { url: thumbnailPhotoUrl } = useAsset(video?.thumbnailPhoto)

  const dummyNfftTileProps: NftTileProps = {
    title: video?.title ?? '',
    videoHref: videoId ? absoluteRoutes.viewer.video(videoId) : undefined,
    buyNow: false,
    role: 'owner' as const,
    auction: 'none' as const,
    bid: 1234,
    minBid: 1234,
    topBid: 123,
    thumbnail: { thumbnailUrl: thumbnailPhotoUrl },
    creator: { assetUrl: activeMembership?.avatarUri, name: activeMembership?.handle },
    owner: { assetUrl: activeMembership?.avatarUri, name: activeMembership?.handle },
    duration: video?.duration,
    views: video?.views,
    loading: loadingVideo,
    fullWidth: false,
  }

  const issueNFTSteps: StepProps[] = [
    {
      variant: 'current',
      title: 'Choose listing type',
    },
    {
      variant: 'future',
      title: 'Set up listing',
    },
    {
      variant: 'future',
      title: 'Accept listing terms',
    },
  ]

  const actionBarPrimaryButton = useMemo(
    () => ({
      text: 'Next step',
      disabled: false,
      onClick: () => {
        if (currentStepIdx < 3) {
          setCurrentStepIdx((current) => current + 1)
        } else {
          // handle issuing NFT here
        }
      },
    }),
    [currentStepIdx]
  )

  const actionBarSecondaryButton = useMemo(
    () => ({
      text: 'Back',
      visible: true,
      onClick: () => {
        if (currentStepIdx > 0) {
          setCurrentStepIdx((current) => current - 1)
        } else {
          onGoBack()
        }
      },
    }),
    [currentStepIdx, onGoBack]
  )

  const actionBarDraftBadge = useMemo(
    () =>
      !isEdit
        ? {
            text: mdMatch ? 'Drafts are saved automatically' : 'Saving drafts',
            tooltip: {
              text: 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
            },
          }
        : undefined,
    [isEdit, mdMatch]
  )

  return (
    <ScrollableWrapper actionBarHeight={actionBarBounds.height}>
      <NFTWorkspaceFormWrapper>
        <NFTPreview>
          <NftTile {...dummyNfftTileProps} />
        </NFTPreview>
        <NFTFormScrolling>
          <NFTFormWrapper>
            <StepperWrapper>
              <StepperInnerWrapper>
                {issueNFTSteps.map((step, idx) => {
                  const stepVariant = getStepVariant(currentStepIdx, idx)
                  const isLast = idx === issueNFTSteps.length - 1
                  return (
                    <StepWrapper key={idx}>
                      <Step showOtherStepsOnMobile number={idx + 1} variant={stepVariant} title={step.title} />
                      {!isLast && <StyledChevron />}
                    </StepWrapper>
                  )
                })}
              </StepperInnerWrapper>
            </StepperWrapper>
            <Title variant="h500">Choose listing type</Title>
            <Paragraph variant="t300" secondary>
              Choose “Not for sale” if you don't want to sell your NFT right away or “Put on marketplace” to sell it on
              auction, or for a fixed price.
            </Paragraph>
          </NFTFormWrapper>
        </NFTFormScrolling>
      </NFTWorkspaceFormWrapper>
      <StyledActionBar
        ref={actionBarRef}
        variant="nft"
        primaryText={`Fee: ${fee} Joy`}
        secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
        primaryButton={actionBarPrimaryButton}
        secondaryButton={actionBarSecondaryButton}
        draftBadge={actionBarDraftBadge}
      />
    </ScrollableWrapper>
  )
}

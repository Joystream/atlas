import React, { useState } from 'react'
import useMeasure from 'react-use-measure'

import { NftTile } from '@/components/NftTile'
import { Step, StepProps, getStepVariant } from '@/components/Step'
import { Paragraph } from '@/components/_inputs/FileSelect/FileSelect.styles'
import { useMediaMatch } from '@/hooks/useMediaMatch'

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
}

export const NFTWorkspaceForm: React.FC<NFTWorkspaceFormProps> = ({ onGoBack }) => {
  const isEdit = false
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [actionBarRef, actionBarBounds] = useMeasure()
  const mdMatch = useMediaMatch('md')
  const dummyNfftTileProps = {
    buyNow: false,
    role: 'owner' as const,
    auction: 'none' as const,
    bid: 1234,
    minBid: 1234,
    topBid: 123,
    thumbnail: { thumbnailUrl: 'https://placedog.net/360/203' },
    creator: { assetUrl: 'https://placedog.net/100/100?random=1', name: 'Jane' },
    owner: { assetUrl: 'https://placedog.net/100/100?random=2', name: 'Kate' },
    duration: 120,
    views: 123456789,
    loading: false,
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

  return (
    <ScrollableWrapper actionBarHeight={actionBarBounds.height}>
      <NFTWorkspaceFormWrapper>
        <NFTPreview>
          <NftTile title="title" {...dummyNfftTileProps} />
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
        primaryText="Fee: 0 Joy"
        secondaryText="Every change to the blockchain requires making a nominal transaction."
        primaryButton={{
          text: 'Next step',
          disabled: false,
          onClick: () => {
            if (currentStepIdx < 3) {
              setCurrentStepIdx((current) => current + 1)
            } else {
              // handle issuing NFT here
            }
          },
        }}
        secondaryButton={{
          text: 'Back',
          visible: true,
          onClick: () => {
            if (currentStepIdx > 0) {
              setCurrentStepIdx((current) => current - 1)
            } else {
              onGoBack()
            }
          },
        }}
        draftBadge={
          isEdit
            ? {
                text: mdMatch ? 'Drafts are saved automatically' : 'Saving drafts',
                tooltip: {
                  text: 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
                },
              }
            : undefined
        }
      />
    </ScrollableWrapper>
  )
}

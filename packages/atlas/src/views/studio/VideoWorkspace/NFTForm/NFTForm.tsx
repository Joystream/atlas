import React from 'react'

import { NftTile } from '@/components/NftTile'
import { Step, StepProps, getStepVariant } from '@/components/Step'
import { Paragraph } from '@/components/_inputs/FileSelect/FileSelect.styles'

import {
  NFTFormScrolling,
  NFTFormWrapper,
  NFTPreview,
  NFTWorkspaceFormWrapper,
  ScrollableWrapper,
  StepWrapper,
  StepperInnerWrapper,
  StepperWrapper,
  StyledChevron,
  Title,
} from './NFTForm.styles'

type NFTFormProps = {
  isEdit?: boolean
  NFTCurrentStepIdx: number
}

export const NFTForm: React.FC<NFTFormProps> = ({ NFTCurrentStepIdx }) => {
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
    <ScrollableWrapper>
      <NFTWorkspaceFormWrapper>
        <NFTPreview>
          <NftTile title="title" {...dummyNfftTileProps} />
        </NFTPreview>
        <NFTFormScrolling>
          <NFTFormWrapper>
            <StepperWrapper>
              <StepperInnerWrapper>
                {issueNFTSteps.map((step, idx) => {
                  const stepVariant = getStepVariant(NFTCurrentStepIdx, idx)
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
    </ScrollableWrapper>
  )
}

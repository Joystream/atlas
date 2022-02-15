import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { NftTile } from '@/components/NftTile'
import { Step, StepProps, getStepVariant } from '@/components/Step'
import { SvgActionChevronR } from '@/components/_icons'
import { NftAuctionInputMetadata } from '@/joystream-lib'
import { VideoWorkspaceFormStatus } from '@/providers/videoWorkspace'
import { Listing, NFTFormData } from '@/views/studio/VideoWorkspace/NFTForm/types'

import { AcceptTerms } from './AcceptTerms'
import { ListingType } from './ListingType'
import {
  NFTFormScrolling,
  NFTFormWrapper,
  NFTPreview,
  NFTWorkspaceFormWrapper,
  ScrollableWrapper,
  StepWrapper,
  StepperInnerWrapper,
  StepperWrapper,
} from './NFTForm.styles'
import { SetUp } from './SetUp'

const DUMMY_NFT_TILE_PROPS = {
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

type NFTFormProps = {
  listingType: Listing
  setFormStatus: Dispatch<SetStateAction<VideoWorkspaceFormStatus<NftAuctionInputMetadata> | null>>
  setListingType: (listingType: Listing) => void
  NFTCurrentStepIdx: number
  onSubmit: (data: NFTFormData) => void
  termsAccepted: boolean
  toggleTermsAccept: () => void
}

export const NFTForm: React.FC<NFTFormProps> = ({
  NFTCurrentStepIdx,
  listingType,
  setFormStatus,
  setListingType,
  onSubmit,
  termsAccepted,
  toggleTermsAccept,
}) => {
  const {
    handleSubmit: createSubmitHandler,
    register,
    reset,
    getValues,
    setValue,
    formState: { isDirty, isValid },
  } = useForm<NFTFormData>({ mode: 'onChange' })
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

  const handleSubmit = useCallback(() => {
    createSubmitHandler(onSubmit)
  }, [createSubmitHandler, onSubmit])

  const formStatus: VideoWorkspaceFormStatus<NFTFormData> = useMemo(
    () => ({
      isDirty,
      isValid,
      formValues: getValues(),
      resetForm: reset,
      triggerFormSubmit: handleSubmit,
    }),
    [getValues, handleSubmit, isDirty, isValid, reset]
  )

  // sent updates on form status to VideoWorkspace
  useEffect(() => {
    setFormStatus(formStatus)
  }, [formStatus, setFormStatus])

  const stepsContent = [
    <ListingType key="step-content-1" selectedType={listingType} onSelectType={setListingType} />,
    <SetUp key="step-content-2" register={register} selectedType={listingType} setValue={setValue} />,
    <AcceptTerms
      key="step-content-3"
      selectedType={listingType}
      formData={getValues()}
      termsAccepted={termsAccepted}
      toggleTermsAccept={toggleTermsAccept}
    />,
  ]

  return (
    <ScrollableWrapper>
      <NFTWorkspaceFormWrapper>
        <NFTPreview>
          <NftTile title="title" {...DUMMY_NFT_TILE_PROPS} />
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
                      {!isLast && <SvgActionChevronR />}
                    </StepWrapper>
                  )
                })}
              </StepperInnerWrapper>
            </StepperWrapper>
            {stepsContent[NFTCurrentStepIdx]}
          </NFTFormWrapper>
        </NFTFormScrolling>
      </NFTWorkspaceFormWrapper>
    </ScrollableWrapper>
  )
}

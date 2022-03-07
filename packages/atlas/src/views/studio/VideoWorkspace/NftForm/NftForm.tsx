import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { useVideo } from '@/api/hooks'
import { NftTile, NftTileProps } from '@/components/NftTile'
import { Step, StepProps, getStepVariant } from '@/components/Step'
import { Text } from '@/components/Text'
import { SvgActionChevronR } from '@/components/_icons'
import { NftAuctionInputMetadata } from '@/joystream-lib'
import { useAsset } from '@/providers/assets'
import { useUser } from '@/providers/user'
import { VideoWorkspaceFormStatus } from '@/providers/videoWorkspace'
import { sizes } from '@/styles'

import { AcceptTerms } from './AcceptTerms'
import { ListingType } from './ListingType'
import { useNftForm } from './NftForm.hooks'
import {
  NftFormScrolling,
  NftFormWrapper,
  NftPreview,
  NftWorkspaceFormWrapper,
  ScrollableWrapper,
  StepWrapper,
  StepperInnerWrapper,
  StepperWrapper,
} from './NftForm.styles'
import { SetUp } from './SetUp'
import { NftFormData } from './types'

const issueNftSteps: StepProps[] = [
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

type NftFormProps = {
  setFormStatus: (data: VideoWorkspaceFormStatus<NftAuctionInputMetadata> | null) => void
  onSubmit: (data: NftFormData) => void
  setIsNftFormOpen: React.Dispatch<React.SetStateAction<boolean>>
  videoId: string
}

export const NftForm: React.FC<NftFormProps> = ({ setFormStatus, onSubmit, setIsNftFormOpen, videoId }) => {
  const { activeMembership } = useUser()
  const {
    state: {
      termsAccepted,
      setTermsAccepted,
      activeInputs,
      setActiveInputs,
      listingType,
      setListingType,
      setCurrentStep,
      currentStep,
    },
  } = useNftForm()
  const {
    handleSubmit: createSubmitHandler,
    register,
    reset,
    getValues,
    setValue,
    watch,
    formState: { isDirty, isValid },
  } = useForm<NftFormData>({ mode: 'onChange' })

  const { video, loading: loadingVideo } = useVideo(videoId, { fetchPolicy: 'cache-only' })
  const { url: thumbnailPhotoUrl } = useAsset(video?.thumbnailPhoto)
  const memberAvatarUri =
    activeMembership?.metadata.avatar?.__typename === 'AvatarUri' ? activeMembership?.metadata.avatar.avatarUri : null

  const handleSubmit = useCallback(() => {
    if (currentStep === 2) {
      createSubmitHandler(onSubmit)
      return
    }
    setCurrentStep((prevState) => prevState + 1)
  }, [createSubmitHandler, currentStep, onSubmit, setCurrentStep])

  const toggleTermsAccept = () => {
    setTermsAccepted((prevState) => !prevState)
  }

  const onGoBack = useCallback(() => {
    if (currentStep === 0) {
      setIsNftFormOpen(false)
      return
    }
    setCurrentStep((prevState) => prevState - 1)
  }, [currentStep, setCurrentStep, setIsNftFormOpen])

  const formDisabled = useMemo(() => {
    if (currentStep === 0) {
      return !!listingType
    }
    if (currentStep === 1) {
      return isValid
    }
    return termsAccepted
  }, [currentStep, isValid, listingType, termsAccepted])

  const actionBarPrimaryText = useMemo(() => {
    if (currentStep === 2) {
      return 'Upload & issue'
    }
    return 'Next step'
  }, [currentStep])

  const formStatus: VideoWorkspaceFormStatus<NftFormData> = useMemo(
    () => ({
      isDirty,
      isValid,
      isDisabled: formDisabled,
      handleGoBack: onGoBack,
      resetForm: reset,
      actionBarPrimaryText,
      triggerFormSubmit: handleSubmit,
      termsAccepted,
      activeInputs,
    }),
    [actionBarPrimaryText, activeInputs, formDisabled, handleSubmit, isDirty, isValid, onGoBack, reset, termsAccepted]
  )

  // sent updates on form status to VideoWorkspace
  useEffect(() => {
    setFormStatus(formStatus)
  }, [formStatus, setFormStatus])

  // Clear form on listing type change
  useEffect(() => {
    if (listingType) {
      reset()
      setActiveInputs([])
    }
  }, [listingType, reset, setActiveInputs])

  const getNftStatus = () => {
    switch (listingType) {
      case 'Not for sale':
        return 'idle'
      case 'Fixed price':
        return 'on-sale'
      case 'Auction':
        return 'auction'
    }
  }

  const nftTileProps: NftTileProps = {
    nftStatus: getNftStatus(),
    thumbnail: { thumbnailUrl: thumbnailPhotoUrl },
    title: video?.title,
    owner:
      getNftStatus() === 'auction'
        ? { assetUrl: null, name: 'Owner: Auction winner' }
        : { assetUrl: memberAvatarUri, name: activeMembership?.handle },
    creator: { assetUrl: memberAvatarUri, name: activeMembership?.handle },
    loading: loadingVideo,
    duration: video?.duration,
    views: video?.views,
    buyNowPrice: watch('buyNowPrice') || 0,
    startingPrice: watch('startingPrice') || 0,
    role: 'owner',
  }

  const stepsContent = [
    <ListingType key="step-content-1" selectedType={listingType} onSelectType={setListingType} />,
    <SetUp
      key="step-content-2"
      register={register}
      selectedType={listingType}
      setValue={setValue}
      activeInputs={activeInputs}
      setActiveInputs={setActiveInputs}
      reset={reset}
      formData={getValues()}
    />,
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
      <NftWorkspaceFormWrapper>
        <NftPreview>
          <NftTile interactable={false} {...nftTileProps} />
          <Text margin={{ top: sizes(4) }} variant="h100" secondary>
            Your nft preview
          </Text>
        </NftPreview>
        <NftFormScrolling>
          <NftFormWrapper lastStep={currentStep === 2}>
            <StepperWrapper>
              <StepperInnerWrapper>
                {issueNftSteps.map((step, idx) => {
                  const stepVariant = getStepVariant(currentStep, idx)
                  const isLast = idx === issueNftSteps.length - 1
                  return (
                    <StepWrapper key={idx}>
                      <Step showOtherStepsOnMobile number={idx + 1} variant={stepVariant} title={step.title} />
                      {!isLast && <SvgActionChevronR />}
                    </StepWrapper>
                  )
                })}
              </StepperInnerWrapper>
            </StepperWrapper>
            {stepsContent[currentStep]}
          </NftFormWrapper>
        </NftFormScrolling>
      </NftWorkspaceFormWrapper>
    </ScrollableWrapper>
  )
}

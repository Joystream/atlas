import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useVideo } from '@/api/hooks'
import { NftTile, NftTileProps } from '@/components/NftTile'
import { Step, StepProps, getStepVariant } from '@/components/Step'
import { Text } from '@/components/Text'
import { SvgActionChevronR } from '@/components/_icons'
import { NFT_MIN_BID_STEP_MULTIPLIER } from '@/config/nft'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useAsset, useMemberAvatar } from '@/providers/assets'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useUser } from '@/providers/user'
import { SentryLogger } from '@/utils/logs'
import { formatDateTime } from '@/utils/time'

import { AcceptTerms } from './AcceptTerms'
import { ListingType } from './ListingType'
import { useNftForm, useNftFormUtils } from './NftForm.hooks'
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
import { NftFormData, NftFormFields, NftFormStatus } from './NftForm.types'
import { createValidationSchema } from './NftForm.utils'
import { SetUp } from './SetUp'

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
  setFormStatus: (data: NftFormStatus) => void
  onSubmit: (data: NftFormData) => void
  videoId: string
}

export const NftForm: React.FC<NftFormProps> = ({ setFormStatus, onSubmit, videoId }) => {
  const { activeMembership } = useUser()
  const {
    state: {
      termsAccepted,
      setTermsAccepted,
      activeInputs,
      setActiveInputs,
      listingType,
      setListingType,
      currentStep,
      previousStep,
      nextStep,
    },
  } = useNftForm()
  const { chainState } = useNftFormUtils()

  const isOnFirstStep = currentStep === 0
  const isOnLastStep = currentStep === 2

  const formMethods = useForm<NftFormFields>({
    mode: 'onChange',
    resolver: (data, ctx, options) => {
      const resolver = zodResolver(createValidationSchema(data, listingType, chainState.nftMinStartingPrice))
      return resolver(data, ctx, options)
    },
    reValidateMode: 'onChange',
    defaultValues: {
      startDate: null,
      endDate: null,
      startingPrice: chainState.nftMinStartingPrice || undefined,
    },
  })
  const {
    handleSubmit: createSubmitHandler,
    reset,
    getValues,
    setValue,
    watch,
    formState: { isValid },
  } = formMethods

  const { video, loading: loadingVideo } = useVideo(videoId, { fetchPolicy: 'cache-only' })

  const { url: channelAvatarUrl } = useAsset(video?.channel.avatarPhoto)
  const { url: thumbnailPhotoUrl } = useAsset(video?.thumbnailPhoto)
  const { url: memberAvatarUri } = useMemberAvatar(activeMembership)

  const { convertMsTimestampToBlock } = useBlockTimeEstimation()
  const [openModal, closeModal] = useConfirmationModal()

  const handleSubmit = useCallback(() => {
    const handler = createSubmitHandler((data) => {
      const startDate = data.startDate?.type === 'date' && data.startDate.date

      if (startDate && new Date() > startDate) {
        // the start date is in the past, abort the submit and show a modal

        openModal({
          title: 'Starting date you set has already past!',
          children: (
            <Text variant="t200" secondary>
              You can’t list on <Text variant="t200">{formatDateTime(startDate)} </Text>
              as this time has already past. Issue with current time or go back to change starting date.
            </Text>
          ),
          primaryButton: {
            variant: 'warning',
            size: 'large',
            text: 'Issue with current time',
            onClick: () => {
              setValue('startDate', null)
              closeModal()
            },
          },
          secondaryButton: {
            variant: 'secondary',
            size: 'large',
            text: 'Change starting date',
            onClick: () => {
              previousStep()
              closeModal()
            },
          },
        })
        return
      }

      if (listingType === 'Fixed price') {
        if (!data.buyNowPrice) {
          SentryLogger.error('Missing buy now price for fixed price NFT', 'NftForm', null, {
            form: { data, listingType },
          })
          return
        }

        onSubmit({
          type: 'buyNow',
          buyNowPrice: data.buyNowPrice,
        })
      } else if (listingType === 'Auction') {
        const startsAtBlock = startDate ? convertMsTimestampToBlock(startDate.getTime()) : undefined
        const startingPrice = data.startingPrice || chainState.nftMinStartingPrice
        const minimalBidStep = Math.ceil(startingPrice * NFT_MIN_BID_STEP_MULTIPLIER)

        if (data.auctionDurationBlocks) {
          // auction has duration, assume english
          onSubmit({
            type: 'english',
            startsAtBlock,
            startingPrice,
            minimalBidStep,
            buyNowPrice: data.buyNowPrice,
            auctionDurationBlocks: data.auctionDurationBlocks,
          })
        } else {
          // auction has no duration, assume open
          onSubmit({
            type: 'open',
            startsAtBlock,
            startingPrice,
            minimalBidStep,
            buyNowPrice: data.buyNowPrice,
          })
        }
      } else {
        SentryLogger.error('Unknown listing type', 'NftForm', null, {
          form: { data, listingType },
        })
      }
    })
    return handler()
  }, [
    chainState.nftMinStartingPrice,
    closeModal,
    convertMsTimestampToBlock,
    createSubmitHandler,
    listingType,
    onSubmit,
    openModal,
    previousStep,
    setValue,
  ])

  const toggleTermsAccept = () => {
    setTermsAccepted((prevState) => !prevState)
  }

  const handleGoForward = useCallback(() => {
    if (isOnLastStep) return
    nextStep()
  }, [isOnLastStep, nextStep])

  const handleGoBack = useCallback(() => {
    if (isOnFirstStep) return
    previousStep()
  }, [isOnFirstStep, previousStep])

  const formDisabled = useMemo(() => {
    if (currentStep === 0) {
      return !listingType
    }
    if (currentStep === 1) {
      return !isValid
    }
    return !termsAccepted
  }, [currentStep, isValid, listingType, termsAccepted])

  const formStatus: NftFormStatus = useMemo(
    () => ({
      isValid,
      isDisabled: formDisabled,
      canGoBack: !isOnFirstStep,
      canGoForward: !isOnLastStep,
      triggerGoBack: handleGoBack,
      triggerGoForward: handleGoForward,
      triggerSubmit: handleSubmit,
    }),
    [isValid, formDisabled, isOnFirstStep, isOnLastStep, handleGoBack, handleGoForward, handleSubmit]
  )

  // sent updates on form status to VideoWorkspace
  useEffect(() => {
    setFormStatus(formStatus)
  }, [formStatus, setFormStatus])

  // Clear form on listing type change
  useEffect(() => {
    reset()
    if (listingType === 'Fixed price') {
      setTimeout(() => {
        setValue('buyNowPrice', 1)
      })
    }
    setActiveInputs([])
  }, [listingType, reset, setActiveInputs, setValue])

  const getNftStatus = () => {
    switch (listingType) {
      case 'Fixed price':
        return 'buy-now'
      case 'Auction':
        return 'auction'
      default:
        return 'idle'
    }
  }

  const nftTileProps: NftTileProps = {
    status: getNftStatus(),
    thumbnail: { thumbnailUrl: thumbnailPhotoUrl },
    title: video?.title,
    owner: { assetUrl: memberAvatarUri, name: activeMembership?.handle },
    creator: { assetUrl: channelAvatarUrl, name: video?.channel.title ?? '' },
    loading: loadingVideo,
    duration: video?.duration,
    views: video?.views,
    buyNowPrice: watch('buyNowPrice') || 0,
    startingPrice: watch('startingPrice') || 0,
  }

  const stepsContent = [
    <ListingType key="step-content-1" selectedType={listingType} onSelectType={setListingType} />,
    <SetUp
      key="step-content-2"
      selectedType={listingType}
      activeInputs={activeInputs}
      setActiveInputs={setActiveInputs}
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
          <Text margin={{ top: 4 }} variant="h100" secondary>
            Your nft preview
          </Text>
        </NftPreview>
        <NftFormScrolling>
          <FormProvider {...formMethods}>
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
          </FormProvider>
        </NftFormScrolling>
      </NftWorkspaceFormWrapper>
    </ScrollableWrapper>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { addMilliseconds } from 'date-fns'
import { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useFullVideo } from '@/api/hooks'
import { Step, StepProps, getStepVariant } from '@/components/Step'
import { Text } from '@/components/Text'
import { SvgActionChevronR } from '@/components/_icons'
import { NftTile, NftTileProps } from '@/components/_nft/NftTile'
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
    title: 'Review listing terms',
  },
]

type NftFormProps = {
  setFormStatus: (data: NftFormStatus) => void
  onSubmit: (data: NftFormData) => void
  videoId: string
}

export const NftForm: FC<NftFormProps> = ({ setFormStatus, onSubmit, videoId }) => {
  const { activeMembership } = useUser()
  const scrollableWrapperRef = useRef<HTMLDivElement>(null)
  const {
    state: { activeInputs, setActiveInputs, listingType, setListingType, currentStep, previousStep, nextStep },
  } = useNftForm()
  const { chainState } = useNftFormUtils()
  const { convertMsTimestampToBlock, convertBlocksToDuration } = useBlockTimeEstimation()

  const isOnFirstStep = currentStep === 0
  const isOnLastStep = currentStep === 2
  const maxStartDate = addMilliseconds(new Date(), convertBlocksToDuration(chainState.nftAuctionStartsAtMaxDelta))
  const maxEndDate = addMilliseconds(new Date(), convertBlocksToDuration(chainState.nftMaxAuctionDuration))

  const formMethods = useForm<NftFormFields>({
    mode: 'onChange',
    resolver: (data, ctx, options) => {
      const resolver = zodResolver(
        createValidationSchema(data, maxStartDate, maxEndDate, listingType, chainState.nftMinStartingPrice)
      )
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
    trigger,
    formState: { isValid },
  } = formMethods

  const { video, loading: loadingVideo } = useFullVideo(videoId, { fetchPolicy: 'cache-only' })

  const { url: channelAvatarUrl } = useAsset(video?.channel.avatarPhoto)
  const { url: thumbnailPhotoUrl } = useAsset(video?.thumbnailPhoto)
  const { url: memberAvatarUri } = useMemberAvatar(activeMembership)

  const [openModal, closeModal] = useConfirmationModal()

  const handleSubmit = useCallback(() => {
    const startDateValue = getValues('startDate')
    const startDate = startDateValue?.type === 'date' && startDateValue.date
    if (startDate && new Date() > startDate) {
      trigger('startDate')
      // the start date is in the past, abort the submit and show a modal
      openModal({
        title: 'Start sale now?',
        children: (
          <Text as="p" variant="t200" color="colorText">
            The start date{' '}
            <Text as="span" variant="t200">
              {formatDateTime(startDate)}{' '}
            </Text>{' '}
            you selected has already passed. Do you want to put your NFT on sale now?
          </Text>
        ),
        primaryButton: {
          variant: 'primary',
          size: 'large',
          text: 'Start sale now',
          onClick: () => {
            setValue('startDate', null)
            closeModal()
            handleSubmit()
          },
        },
        secondaryButton: {
          variant: 'secondary',
          size: 'large',
          text: 'Cancel',
          onClick: () => {
            previousStep()
            closeModal()
          },
        },
      })
      return
    }

    const handler = createSubmitHandler((data) => {
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
            buyNowPrice: data.buyNowPrice || undefined,
            auctionDurationBlocks: data.auctionDurationBlocks,
            whitelistedMembersIds: data.whitelistedMembers?.map((member) => member.id),
          })
        } else {
          // auction has no duration, assume open
          onSubmit({
            type: 'open',
            startsAtBlock,
            startingPrice,
            minimalBidStep,
            buyNowPrice: data.buyNowPrice || undefined,
            whitelistedMembersIds: data.whitelistedMembers?.map((member) => member.id),
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
    getValues,
    listingType,
    onSubmit,
    openModal,
    previousStep,
    setValue,
    trigger,
  ])

  const handleGoForward = useCallback(() => {
    scrollableWrapperRef.current?.scrollIntoView()
    if (isOnLastStep) return
    nextStep()
  }, [isOnLastStep, nextStep])

  const handleGoBack = useCallback(() => {
    if (isOnFirstStep) return
    scrollableWrapperRef.current?.scrollIntoView()
    previousStep()
  }, [isOnFirstStep, previousStep])

  const formDisabled = useMemo(() => {
    if (currentStep === 0) {
      return !listingType
    }
    if (currentStep === 1) {
      return !isValid
    }
    return false
  }, [currentStep, isValid, listingType])

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
    thumbnail: { thumbnailUrl: thumbnailPhotoUrl, type: 'video' },
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
      maxStartDate={maxStartDate}
      maxEndDate={maxEndDate}
      key="step-content-2"
      selectedType={listingType}
      activeInputs={activeInputs}
      setActiveInputs={setActiveInputs}
      handleGoForward={handleGoForward}
    />,
    <AcceptTerms key="step-content-3" selectedType={listingType} formData={getValues()} />,
  ]

  return (
    <ScrollableWrapper ref={scrollableWrapperRef}>
      <NftWorkspaceFormWrapper>
        <NftPreview fixedHeight={scrollableWrapperRef.current?.clientHeight}>
          <NftTile interactable={false} {...nftTileProps} />
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

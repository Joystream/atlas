import { zodResolver } from '@hookform/resolvers/zod'
import { BN } from 'bn.js'
import { addMilliseconds } from 'date-fns'
import { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useBasicVideo } from '@/api/hooks/video'
import { SvgActionChevronR } from '@/assets/icons'
import { Step, StepProps, getStepVariant } from '@/components/Step'
import { Text } from '@/components/Text'
import { NftTile, NftTileProps } from '@/components/_nft/NftTile'
import { atlasConfig } from '@/config'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { NftBuyNowInputMetadata, NftSaleInputMetadata } from '@/joystream-lib/types'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useFee } from '@/providers/joystream/joystream.hooks'
import { useUser } from '@/providers/user/user.hooks'
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
import { Listing, NftFormData, NftFormFields, NftFormStatus } from './NftForm.types'
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
  const { activeMembership, memberId } = useUser()
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
    resolver: (data, ctx, options) => {
      const resolver = zodResolver(
        createValidationSchema(
          data,
          maxStartDate,
          maxEndDate,
          listingType,
          chainState.nftMinStartingPrice,
          chainState.nftMaxStartingPrice
        )
      )
      return resolver(data, ctx, options)
    },
    mode: 'onBlur',
    defaultValues: {
      startDate: null,
      endDate: null,
      startingPrice: hapiBnToTokenNumber(chainState.nftMinStartingPrice, true),
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

  const { video, loading: loadingVideo } = useBasicVideo(videoId, { fetchPolicy: 'cache-only' })

  const channelAvatarUrl = video?.channel.avatarPhoto?.resolvedUrl
  const thumbnailPhotoUrl = video?.thumbnailPhoto?.resolvedUrl
  const { url: memberAvatarUri } = getMemberAvatar(activeMembership)

  const [openModal, closeModal] = useConfirmationModal()

  const createBuyNowPriceMetadata = (data: NftFormFields): NftBuyNowInputMetadata | undefined => {
    return {
      type: 'buyNow',
      buyNowPrice: data.buyNowPrice ? tokenNumberToHapiBn(data.buyNowPrice).toString() : '0',
    }
  }

  const createAuctionMetadata = useCallback(
    (data: NftFormFields): NftSaleInputMetadata | undefined => {
      const startDateValue = getValues('startDate')
      const startDate = startDateValue?.type === 'date' && startDateValue.date
      const startsAtBlock = startDate ? convertMsTimestampToBlock(startDate.getTime()) : undefined
      const startingPrice = data.startingPrice
        ? tokenNumberToHapiBn(data.startingPrice)
        : chainState.nftMinStartingPrice
      const minimalBidStep = BN.max(
        startingPrice.muln(atlasConfig.features.nft.auctionMinimumBidStepMultiplier),
        chainState.minBidStep
      )
      const buyNowPrice = data.buyNowPrice ? tokenNumberToHapiBn(data.buyNowPrice) : undefined

      const sharedMetadata = {
        startsAtBlock,
        startingPrice: startingPrice.toString(),
        minimalBidStep: minimalBidStep.toString(),
        buyNowPrice: buyNowPrice?.toString(),
        whitelistedMembersIds: data.whitelistedMembers?.map((member) => member.id),
      }

      if (data.auctionDurationBlocks) {
        // auction has duration, assume english
        return {
          type: 'english',
          auctionDurationBlocks: data.auctionDurationBlocks,
          ...sharedMetadata,
        }
      } else {
        // auction has no duration, assume open
        return {
          type: 'open',
          ...sharedMetadata,
        }
      }
    },
    [chainState.minBidStep, chainState.nftMinStartingPrice, convertMsTimestampToBlock, getValues]
  )

  const getInputMetadataData = useCallback(
    (data: NftFormFields) => {
      if (listingType === 'Auction') {
        return createAuctionMetadata(data)
      }
      if (listingType === 'Fixed price') {
        return createBuyNowPriceMetadata(data)
      }
      return
    },
    [createAuctionMetadata, listingType]
  )

  const inputMetadata = getInputMetadataData(getValues())
  const { fullFee: fee, loading: feeLoading } = useFee(
    'putNftOnSaleTx',
    memberId && inputMetadata ? [videoId, memberId, inputMetadata] : undefined
  )

  const handleSubmit = useCallback(() => {
    const startDateValue = watch('startDate')
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
          buyNowPrice: tokenNumberToHapiBn(data.buyNowPrice).toString(),
        })
      } else if (listingType === 'Auction') {
        const inputMetadata = createAuctionMetadata(data)
        if (inputMetadata) {
          onSubmit(inputMetadata)
        }
      } else {
        SentryLogger.error('Unknown listing type', 'NftForm', null, {
          form: { data, listingType },
        })
      }
    })
    return handler()
  }, [
    closeModal,
    createAuctionMetadata,
    createSubmitHandler,
    listingType,
    onSubmit,
    openModal,
    previousStep,
    setValue,
    trigger,
    watch,
  ])

  const handleGoForward = useCallback(async () => {
    const triggerResult = await trigger()
    if (!triggerResult) {
      return
    }
    scrollableWrapperRef.current?.scrollIntoView()
    if (isOnLastStep) return
    nextStep()
  }, [isOnLastStep, nextStep, trigger])

  const handleGoBack = useCallback(() => {
    if (isOnFirstStep) return
    scrollableWrapperRef.current?.scrollIntoView()
    previousStep()
  }, [isOnFirstStep, previousStep])

  const formStatus: NftFormStatus = useMemo(
    () => ({
      isValid,
      canGoBack: !isOnFirstStep,
      canGoForward: !isOnLastStep,
      actionBarFee: fee,
      actionBarLoading: feeLoading,
      triggerGoBack: handleGoBack,
      triggerGoForward: handleGoForward,
      triggerSubmit: handleSubmit,
    }),
    [isValid, isOnFirstStep, isOnLastStep, fee, feeLoading, handleGoBack, handleGoForward, handleSubmit]
  )

  // sent updates on form status to VideoWorkspace
  useEffect(() => {
    setFormStatus(formStatus)
  }, [formStatus, setFormStatus])

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
    views: video?.viewsNum,
    buyNowPrice: tokenNumberToHapiBn(watch('buyNowPrice') || 0),
    startingPrice: tokenNumberToHapiBn(watch('startingPrice') || 0),
  }

  const handleSelectType = (selectedType: Listing) => {
    // Clear form on listing type change
    reset()
    if (selectedType === 'Fixed price') {
      setTimeout(() => {
        setValue('buyNowPrice', 1)
      })
    }
    setActiveInputs(['startingPrice'])

    setListingType(selectedType)
  }

  const stepsContent = [
    <ListingType key="step-content-1" selectedType={listingType} onSelectType={handleSelectType} />,
    <SetUp
      maxStartDate={maxStartDate}
      maxEndDate={maxEndDate}
      key="step-content-2"
      selectedType={listingType}
      activeInputs={activeInputs}
      setActiveInputs={setActiveInputs}
      handleGoForward={handleGoForward}
    />,
    <AcceptTerms
      key="step-content-3"
      selectedType={listingType}
      formData={getValues()}
      creatorRoyalty={video?.nft?.creatorRoyalty}
      channelTitle={video?.channel.title}
      fee={fee}
      isOwnedByChannel={video?.nft?.owner.__typename === 'NftOwnerChannel'}
    />,
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

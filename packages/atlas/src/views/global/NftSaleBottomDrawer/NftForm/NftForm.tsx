import { zodResolver } from '@hookform/resolvers/zod'
import { format as formatDate } from 'date-fns'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useVideo } from '@/api/hooks'
import { NftTile, NftTileProps } from '@/components/NftTile'
import { Step, StepProps, getStepVariant } from '@/components/Step'
import { Text } from '@/components/Text'
import { SvgActionChevronR } from '@/components/_icons'
import { useAsset, useMemberAvatar } from '@/providers/assets'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useUser } from '@/providers/user'

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
import { NftFormData, NftFormStatus } from './NftForm.types'
import { SetUp } from './SetUp'

const DATE_FORMAT = 'dd MMM yyyy, HH:mm'

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

  const isOnFirstStep = currentStep === 0
  const isOnLastStep = currentStep === 2

  const auctionDateType = z
    .union([
      z.object({
        type: z.literal('date'),
        date: z.date(),
      }),
      z.object({
        type: z.literal('duration'),
        durationDays: z.number().nullable(),
      }),
    ])
    .nullable()
    .optional()

  const schema = z.object({
    startDate: auctionDateType.refine(
      (val) => {
        if (val?.type === 'date') {
          return new Date() < val.date
        }
        return true
      },
      { message: 'You cannot select a past date as a start of an auction' }
    ),
    endDate: auctionDateType
      .refine(
        (val) => {
          if (val?.type === 'date') {
            return new Date() < val.date
          }
          return true
        },
        { message: 'You cannot select a past date as an end of an auction' }
      )
      .refine(
        (val) => {
          const startDate = getValues('startDate')
          if (val?.type === 'date' && startDate?.type === 'date') {
            if (startDate.date < val.date) {
              return true
            } else {
              return false
            }
          }
          return true
        },
        { message: 'Expiration date cannot be earlier than starting date' }
      ),
  })

  const {
    handleSubmit: createSubmitHandler,
    register,
    reset,
    getValues,
    setValue,
    control,
    watch,
    formState: { isValid, errors },
  } = useForm<NftFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    reValidateMode: 'onChange',
    defaultValues: {
      startDate: null,
      endDate: null,
    },
  })

  const { video, loading: loadingVideo } = useVideo(videoId, { fetchPolicy: 'cache-only' })
  const { url: channelAvatarUrl } = useAsset(video?.channel.avatarPhoto)
  const { url: thumbnailPhotoUrl } = useAsset(video?.thumbnailPhoto)
  const { url: memberAvatarUri } = useMemberAvatar(activeMembership)
  const [openModal, closeModal] = useConfirmationModal()

  const handleSubmit = useCallback(() => {
    if (isOnLastStep) {
      const startDate = getValues('startDate')

      if (startDate instanceof Date && new Date() > startDate) {
        openModal({
          title: 'Starting date you set has already past!',
          children: (
            <Text variant="t200" secondary>
              You can’t list on <Text variant="t200">{formatDate(startDate, DATE_FORMAT)} </Text>
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
      } else {
        createSubmitHandler(onSubmit)
      }
      return
    }
    previousStep()
  }, [closeModal, createSubmitHandler, getValues, isOnLastStep, onSubmit, openModal, previousStep, setValue])

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
    if (listingType) {
      reset()
      setActiveInputs([])
    }
  }, [listingType, reset, setActiveInputs])

  const getNftStatus = () => {
    switch (listingType) {
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
    owner: { assetUrl: memberAvatarUri, name: activeMembership?.handle },
    creator: { assetUrl: channelAvatarUrl, name: video?.channel.title ?? '' },
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
      watch={watch}
      control={control}
      errors={errors}
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
          <Text margin={{ top: 4 }} variant="h100" secondary>
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

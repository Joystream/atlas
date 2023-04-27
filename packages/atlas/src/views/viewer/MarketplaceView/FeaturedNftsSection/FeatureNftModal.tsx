import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  GetNftDocument,
  GetNftQuery,
  GetNftQueryVariables,
  useRequestNftFeaturedMutation,
} from '@/api/queries/__generated__/nfts.generated'
import { Text } from '@/components/Text'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { useSnackbar } from '@/providers/snackbars'
import { SentryLogger } from '@/utils/logs'

import { PreviewWrapper, StyledFormField } from './FeaturedNftsSection.styles'

type FeatureNftModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const FeatureNftModal: FC<FeatureNftModalProps> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm<{ url: string }>()
  const [isInputValidating, setIsInputValidating] = useState(false)

  const handleClose = () => {
    onClose()
    setVideoId('')
    reset({ url: '' })
  }
  const [videoId, setVideoId] = useState('')
  const [requestNftFeaturedMutation, { loading }] = useRequestNftFeaturedMutation({
    onError: (error) => {
      displaySnackbar({
        title: 'Something went wrong',
        description: 'There was a problem with sending your request. Please try again later.',
        iconType: 'error',
      })
      SentryLogger.error('Error during sending requestNftFeaturedMutation', 'FeatureNftModal', { videoId, error })
    },
    onCompleted: () => {
      displaySnackbar({
        title: 'Video submitted succesfully',
        description: 'Thanks! We will review your video shortly. Keep an eye on the featured section.',
        iconType: 'success',
      })
      handleClose()
    },
  })

  const { displaySnackbar } = useSnackbar()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const submit = () => {
    handleSubmit(async (data) => {
      const videoId = /[^/]*$/.exec(data.url)?.[0]
      if (!videoId) {
        return
      }

      await requestNftFeaturedMutation({
        variables: {
          nftId: videoId,
          rationale: '',
        },
      })
    })()
  }

  const client = useApolloClient()

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const validateNft = useCallback(
    async (id?: string) => {
      if (!id) {
        return 'Enter a valid link to your video NFT.'
      }
      const {
        data: { ownedNftById },
      } = await client.query<GetNftQuery, GetNftQueryVariables>({
        query: GetNftDocument,
        variables: {
          id: id,
        },
      })
      if (!ownedNftById) {
        return 'This video is not an NFT.'
      }
      setVideoId(id)
      if (
        ownedNftById.transactionalStatus?.__typename === 'TransactionalStatusIdle' ||
        ownedNftById.transactionalStatus?.__typename === 'TransactionalStatusInitiatedOfferToMember'
      ) {
        return "This video's NFT is not put on sale."
      }

      if (
        ownedNftById.transactionalStatus?.__typename === 'TransactionalStatusAuction' &&
        ownedNftById.transactionalStatus.auction.isCompleted
      ) {
        return "This video's NFT is not put on sale."
      }
      return true
    },
    [client]
  )

  const { ref, ...inputRefRest } = useMemo(() => {
    return register('url', {
      onChange: debouncePromise(
        async () => {
          await trigger('url')
          setIsInputValidating(false)
        },
        500,
        {
          key() {
            setIsInputValidating(true)
            return null
          },
        }
      ),
      required: { value: true, message: 'Enter link to your video NFT.' },
      validate: {
        validUrl: (val) => {
          return val.startsWith(window.location.origin + '/video/') ? true : 'Enter a valid link to your video NFT.'
        },
        nftIsValid: async (val) => {
          // get the last string after slash
          const videoId = /[^/]*$/.exec(val)?.[0]
          const validation = await validateNft(videoId)

          return validation
        },
      },
    })
  }, [register, trigger, validateNft])

  const isInputRefActiveElement = document.activeElement === inputRef.current
  return (
    <DialogModal
      title="Apply for featured section"
      show={isOpen}
      noContentPadding
      primaryButton={{
        text: loading ? 'Please wait...' : 'Submit video',
        disabled: loading,
        onClick: submit,
      }}
      secondaryButton={{
        text: 'Cancel',
        disabled: loading,
        onClick: handleClose,
      }}
      onExitClick={handleClose}
    >
      <StyledFormField
        disableErrorAnimation={isInputRefActiveElement}
        error={errors.url?.message}
        label="Link to your video NFT"
        description="Make sure your video NFT is listed on sale (or an upcoming sale) at the time of submission."
      >
        <Input
          {...inputRefRest}
          ref={(e) => {
            ref(e)
            inputRef.current = e
          }}
          processing={isInputValidating}
          autoComplete="off"
          placeholder="Paste your link here"
          error={!!errors.url}
        />
      </StyledFormField>
      <PreviewWrapper>
        {videoId ? (
          <VideoTileViewer direction="horizontal" id={videoId} detailsVariant="withChannelName" />
        ) : (
          <Text variant="t200" as="p" color="colorTextMuted">
            Preview of your video will appear here
          </Text>
        )}
      </PreviewWrapper>
    </DialogModal>
  )
}

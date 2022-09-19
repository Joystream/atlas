import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { useReportChannelMutation } from '@/api/queries/__generated__/channels.generated'
import { useReportVideoMutation } from '@/api/queries/__generated__/videos.generated'
import { FormField } from '@/components/_inputs/FormField'
import { TextArea } from '@/components/_inputs/TextArea'
import { APP_NAME } from '@/config/env'
import { useSnackbar } from '@/providers/snackbars'

import { DialogModal } from '../DialogModal'

type ReportModalProps = {
  /**
   * @param entityId __channel.id__ or __video.id__
   */
  entityId: string
  show: boolean
  onClose: () => void
  type: 'video' | 'channel'
}

export const ReportModal: FC<ReportModalProps> = ({ entityId, show, onClose, type }) => {
  const [reportVideo, { loading: reportVideoLoading }] = useReportVideoMutation()
  const [reportChannel, { loading: reportChannelLoading }] = useReportChannelMutation()
  const { displaySnackbar } = useSnackbar()
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<{ rationale: string }>()

  const handleClose = () => {
    resetField('rationale')
    onClose()
  }

  const submit = handleSubmit(async ({ rationale }) => {
    try {
      if (type === 'video') {
        await reportVideo({
          variables: {
            rationale: rationale,
            videoId: entityId,
          },
        })
      }
      if (type === 'channel') {
        await reportChannel({
          variables: {
            rationale: rationale,
            channelId: entityId,
          },
        })
      }
      handleClose()
      displaySnackbar({
        title: 'Thank you for your report',
        description: `Your report helps make ${APP_NAME} a better place. Our team will be reviewing it shortly and taking action if necessary.`,
        iconType: 'success',
      })
    } catch (error) {
      displaySnackbar({
        title: 'Something went wrong',
        description: 'There was a problem with sending your report. Please try again later.',
        iconType: 'error',
      })
    }
  })
  return (
    <DialogModal
      title={`Report ${type}`}
      show={show}
      onSubmit={submit}
      secondaryButton={{
        text: 'Cancel',
        onClick: handleClose,
      }}
      primaryButton={{
        disabled: reportVideoLoading || reportChannelLoading,
        type: 'submit',
        text: reportVideoLoading || reportChannelLoading ? 'Please wait...' : 'Send report',
      }}
    >
      <FormField
        error={errors.rationale?.message}
        label="Details"
        description={`Additional information on why you think this ${type} needs to be reviewed. ${
          type === 'video' ? 'Provide timestamp if applicable.' : ''
        }`}
      >
        <TextArea
          {...register('rationale', {
            required: { value: true, message: 'Provide details for your report.' },
            maxLength: { value: 400, message: 'Your report is too long.' },
          })}
          counter
          error={!!errors.rationale}
          maxLength={400}
        />
      </FormField>
    </DialogModal>
  )
}

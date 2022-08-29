import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { useReportChannelMutation, useReportVideoMutation } from '@/api/queries'
import { FormField } from '@/components/_inputs/FormField'
import { TextArea } from '@/components/_inputs/TextArea'
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
    formState: { errors },
  } = useForm<{ rationale: string }>()

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
      onClose()
      displaySnackbar({
        title: 'Thank you for your report',
        description:
          'Your report helps make Atlas a better place. Our team will be reviewing it shortly and taking action if necessary.',
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
      onExitClick={onClose}
      title={`Report ${type}`}
      show={show}
      onSubmit={submit}
      secondaryButton={{
        text: 'Cancel',
        onClick: onClose,
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
          {...register('rationale', { required: { value: true, message: 'Provide details for your report.' } })}
          counter
          error={!!errors.rationale}
          maxLength={400}
        />
      </FormField>
    </DialogModal>
  )
}

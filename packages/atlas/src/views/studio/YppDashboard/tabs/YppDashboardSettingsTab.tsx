import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router'

import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { atlasConfig } from '@/config'
import { displayCategories } from '@/config/categories'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useChannelsStorageBucketsCount } from '@/providers/assets/assets.hooks'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useBloatFeesAndPerMbFees, useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { TX_SIGN_CANCELLED_SNACKBAR_TIMEOUT } from '@/providers/transactions/transactions.config'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/YppLandingView.hooks'

import {
  Divider,
  SettingsInputsWrapper,
  StyledActionBar,
  StyledSvgActionArrowRight,
  StyledSvgAlertsWarning32,
} from './YppDashboardTabs.styles'

type OptoutChannelMessage = {
  optout: boolean
  timestamp: string
}

type IngestChannelMessage = {
  shouldBeIngested: boolean
  timestamp: string
  videoCategoryId?: string
}

const categoriesSelectItems: SelectItem[] =
  displayCategories?.map((c) => ({
    name: c.name || 'Unknown category',
    value: c.defaultVideoCategory,
  })) || []

type SettingsParams = {
  message: IngestChannelMessage
  signature: string | undefined
}

export const YppDashboardSettingsTab = () => {
  const mdMatch = useMediaMatch('md')
  const navigate = useNavigate()
  const { displaySnackbar } = useSnackbar()
  const { channelId, memberId, accountId } = useUser()
  const { currentChannel, refetchYppSyncedChannels, isLoading } = useGetYppSyncedChannels()
  const { joystream, proxyCallback } = useJoystream()
  const [openModal, closeModal] = useConfirmationModal()
  const { mutateAsync: settingsMutation } = useMutation(
    ['ypp-settings-post', currentChannel],
    (params: SettingsParams) =>
      axios.put(
        `${atlasConfig.features.ypp.youtubeSyncApiUrl}/channels/${currentChannel?.joystreamChannelId}/ingest`,
        params
      )
  )

  const [signLoading, setSignLoading] = useState(false)
  const [categoryError, setCategoryErrror] = useState<null | string>(null)

  const handleTransaction = useTransaction()
  const { dataObjectStateBloatBondValue } = useBloatFeesAndPerMbFees()
  const channelBucketsCount = useChannelsStorageBucketsCount(channelId)

  const [isSync, setIsSync] = useState(currentChannel?.shouldBeIngested)
  const [categoryId, setCategoryId] = useState<string | null | undefined>(currentChannel?.videoCategoryId)
  const areSettingsChanged = currentChannel
    ? currentChannel.videoCategoryId !== categoryId || currentChannel?.shouldBeIngested !== isSync
    : false

  useEffect(() => {
    if (currentChannel) {
      setCategoryId(currentChannel.videoCategoryId)
      setIsSync(currentChannel.shouldBeIngested)
    }
  }, [currentChannel])

  const handleSubmitChangeSettings = useCallback(async () => {
    if (!accountId || !joystream) {
      SentryLogger.error('No joystream instance', 'YppDashboardSettingsTab')
      return
    }

    if (!currentChannel || isSync === undefined) {
      SentryLogger.error("Couldn't fetch current channel", 'YppDashboardSettingsTab')
      return
    }

    if (isSync && !categoryId) {
      setCategoryErrror('Select category of imported videos')
      return
    }

    try {
      const message: IngestChannelMessage = {
        shouldBeIngested: isSync,
        timestamp: new Date().toISOString(),
        ...(categoryId ? { videoCategoryId: categoryId } : {}),
      }
      setSignLoading(true)
      const signature = await joystream.signMessage({
        data: JSON.stringify(message),
        type: 'payload',
      })

      const data = await settingsMutation({
        message,
        signature,
      })

      if (data.status === 200) {
        displaySnackbar({
          title: 'Settings updated successfully',
          description: isSync
            ? 'We started syncing your YouTube videos. Please allow 30 to 60 minutes for your videos to start showing up on the My videos page.'
            : 'Your videos will no longer be synced with your YouTube channel.',
          iconType: 'success',
          actionText: isSync ? 'Go to My Videos' : undefined,
          onActionClick: () => navigate(absoluteRoutes.studio.videos()),
        })
        refetchYppSyncedChannels()
      }
    } catch (e) {
      if (e.message === 'Cancelled') {
        ConsoleLogger.warn('Sign cancelled')
        displaySnackbar({
          title: 'Message signing cancelled',
          iconType: 'warning',
          timeout: TX_SIGN_CANCELLED_SNACKBAR_TIMEOUT,
        })
        return
      }
      SentryLogger.error('Error while updating YPP setting: ', e)
      displaySnackbar({
        title: 'Something went wrong',
        description: 'Failed to update settings. Try again later',
        iconType: 'error',
      })
    } finally {
      setSignLoading(false)
    }
  }, [
    settingsMutation,
    accountId,
    categoryId,
    currentChannel,
    displaySnackbar,
    isSync,
    joystream,
    navigate,
    refetchYppSyncedChannels,
  ])

  const handleLeaveTx = useCallback(async () => {
    if (!accountId || !joystream || !channelId || !memberId) {
      SentryLogger.error('No joystream instance', 'YppDashboardSettingsTab')
      return
    }

    if (!currentChannel) {
      SentryLogger.error("Couldn't fetch current channel", 'YppDashboardSettingsTab')
      return
    }
    try {
      const message: OptoutChannelMessage = {
        optout: true,
        timestamp: new Date().toISOString(),
      }

      closeModal()
      const signature = await joystream.signMessage({
        data: JSON.stringify(message),
        type: 'payload',
      })

      if (signature) {
        const completed = await handleTransaction({
          txFactory: async (updateStatus) => {
            return (await joystream.extrinsics).updateChannel(
              channelId,
              memberId,
              { ownerAccount: memberId },
              {},
              [],
              dataObjectStateBloatBondValue.toString(),
              channelBucketsCount.toString(),
              null,
              proxyCallback(updateStatus)
            )
          },
        })

        if (completed) {
          const data = await axios.put(
            `${atlasConfig.features.ypp.youtubeSyncApiUrl}/channels/${currentChannel.joystreamChannelId}/optout`,
            { message, signature }
          )
          if (data.status === 200) {
            displaySnackbar({
              title: 'You left the program',
              description:
                'You are no longer member of the YouTube Partner Program. You can now connect your YouTube channel with another Joystream channel.',
              iconType: 'success',
            })
          }
          navigate(absoluteRoutes.studio.ypp())
        }
      }
    } catch (e) {
      if (e.message === 'Cancelled') {
        ConsoleLogger.warn('Sign cancelled')
        displaySnackbar({
          title: 'Message signing cancelled',
          iconType: 'warning',
          timeout: TX_SIGN_CANCELLED_SNACKBAR_TIMEOUT,
        })
        return
      }

      SentryLogger.error('Error while opting out: ', e)
      displaySnackbar({
        title: 'Something went wrong',
        description: 'Failed to leave the program. Try again later',
        iconType: 'error',
      })
    }
  }, [
    accountId,
    channelBucketsCount,
    channelId,
    closeModal,
    currentChannel,
    dataObjectStateBloatBondValue,
    displaySnackbar,
    handleTransaction,
    joystream,
    memberId,
    navigate,
    proxyCallback,
  ])

  const handleCancel = () => {
    setCategoryId(currentChannel?.videoCategoryId)
    setIsSync(currentChannel?.shouldBeIngested)
  }

  const openModalOptions = {
    title: 'Leave the program?',
    headerIcon: <StyledSvgAlertsWarning32 />,
    primaryButton: {
      text: 'Leave the program',
      variant: 'destructive' as const,
      onClick: handleLeaveTx,
    },
    secondaryButton: {
      text: 'Cancel',
      variant: 'secondary' as const,
      onClick: () => closeModal(),
    },
    description:
      'Are you sure you want to leave the program? You will no longer receive rewards for performing the tasks, and your future YouTube videos will not be imported automatically to Joystream. ',
  }

  return (
    <>
      <SettingsInputsWrapper>
        <FormField
          label="YouTube Sync"
          description={
            <>
              {`With YouTube Sync enabled, ${atlasConfig.general.appName} will import videos from your YouTube channel over to Joystream. `}
              <Button _textOnly iconPlacement="right" icon={<StyledSvgActionArrowRight />}>
                Learn more
              </Button>
            </>
          }
        >
          <OptionCardGroupRadio
            disabled={isLoading}
            options={[
              { value: true, label: 'Sync YouTube videos', caption: 'Imports past and future videos' },
              {
                value: false,
                label: "Don't sync YouTube videos",
                caption: 'Pauses importing of future videos',
              },
            ]}
            selectedValue={isSync}
            onChange={setIsSync as (value: string | number | boolean) => void}
            direction={!mdMatch ? 'vertical' : 'horizontal'}
          />
        </FormField>
        {isSync && (
          <FormField
            error={categoryError || undefined}
            label="Category of imported videos"
            description="Choose a category to be assigned to the imported videos by default. You can change it for each video later once it’s imported."
          >
            <Select
              error={!!categoryError}
              items={categoriesSelectItems}
              onChange={(category) => {
                setCategoryErrror(null)
                setCategoryId(category)
              }}
              value={categoryId}
            />
          </FormField>
        )}

        <Divider withMargin />

        <FormField
          label="Danger zone"
          description="By leaving the program you will no longer receive rewards for performing the tasks, and your future YouTube videos will not be imported automatically to Joystream. You will be able to connect your YouTube channel with another Joystream channel."
        >
          <Button variant="destructive-secondary" fullWidth size="large" onClick={() => openModal(openModalOptions)}>
            Leave the program
          </Button>
        </FormField>
      </SettingsInputsWrapper>
      <StyledActionBar
        isActive={areSettingsChanged}
        isNoneCrypto
        primaryButton={{
          text: isLoading || signLoading ? 'Please wait...' : 'Publish changes',
          onClick: handleSubmitChangeSettings,
          disabled: isLoading || signLoading,
        }}
        secondaryButton={{
          text: 'Cancel',
          onClick: handleCancel,
        }}
      />
    </>
  )
}

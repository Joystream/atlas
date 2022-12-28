import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { atlasConfig } from '@/config'
import { displayCategories } from '@/config/categories'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useSnackbar } from '@/providers/snackbars'
import { SentryLogger } from '@/utils/logs'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/YppLandingView.hooks'
import { StyledActionBar } from '@/views/viewer/EditMembershipView/EditMembershipView.styles'

import {
  Divider,
  SettingsInputsWrapper,
  StyledSvgActionArrowRight,
  StyledSvgAlertsWarning32,
} from './YppDashboardTabs.styles'

const categoriesSelectItems: SelectItem[] =
  displayCategories?.map((c) => ({
    name: c.name || 'Unknown category',
    value: c.defaultVideoCategory,
  })) || []

export const YppDashboardSettingsTab = () => {
  const mdMatch = useMediaMatch('md')
  const { displaySnackbar } = useSnackbar()
  const { currentChannel, refetchSyncedChannels } = useGetYppSyncedChannels()
  const [openModal, closeModal] = useConfirmationModal()

  const [isSync, setIsSync] = useState(currentChannel?.shouldBeIngested)
  const [category, setCategory] = useState<string | null | undefined>(currentChannel?.videoCategoryId)
  const areSettingsChanged = currentChannel
    ? currentChannel.videoCategoryId !== category || currentChannel?.shouldBeIngested !== isSync
    : false
  useEffect(() => {
    if (currentChannel) {
      setCategory(currentChannel.videoCategoryId)
      setIsSync(currentChannel.shouldBeIngested)
    }
  }, [currentChannel])

  const handleChangeSettings = useCallback(async () => {
    if (!currentChannel) return
    try {
      const data = await axios.put(
        `${atlasConfig.features.ypp.youtubeSyncApiUrl}/channels/${currentChannel.joystreamChannelId}`,
        {
          category,
          isSync,
        }
      )

      if (data.status === 200) {
        displaySnackbar({
          title: 'Settings updated successfully',
          description: 'Your videos will no longer be synced with your YouTube channel.',
          iconType: 'success',
        })
        refetchSyncedChannels()
      }
    } catch (e) {
      SentryLogger.error('Error while updating YPP setting: ', e)
    }
  }, [currentChannel, category, isSync, displaySnackbar, refetchSyncedChannels])

  // todo
  const handleLeaveTx = useCallback(() => {
    displaySnackbar({
      title: 'You left the progam',
      description:
        'You are no longer member of the YouTube Partner Program. You can now connect your YouTube channel with another Joystream channel.',
      iconType: 'success',
    })
    closeModal()
  }, [closeModal, displaySnackbar])

  const openModalOptions = {
    title: 'Leave the program?',
    headerIcon: <StyledSvgAlertsWarning32 />,
    primaryButton: {
      text: 'Leave the program',
      variant: 'destructive' as const,
      onClick: () => handleLeaveTx(),
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
            options={[
              { value: true, label: 'Sync YouTube videos', caption: 'Imports past and future videos' },
              { value: false, label: "Don't sync YouTube videos", caption: 'Pauses importing of future videos' },
            ]}
            selectedValue={isSync}
            onChange={setIsSync as (value: string | number | boolean) => void}
            direction={!mdMatch ? 'vertical' : 'horizontal'}
          />
        </FormField>
        {isSync && (
          <FormField
            label="Category of imported videos"
            description="Choose a category to be assigned to the imported videos by default. You can change it for each video later once it’s imported."
          >
            <Select
              disabled={currentChannel?.shouldBeIngested}
              items={categoriesSelectItems}
              onChange={setCategory}
              value={category}
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
          text: 'Publish changes',
          onClick: () => handleChangeSettings(),
        }}
        secondaryButton={{
          text: 'Cancel',
          onClick: () => {
            setCategory(currentChannel?.videoCategoryId)
          },
        }}
      />
    </>
  )
}

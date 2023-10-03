import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { PageTabs } from '@/components/PageTabs'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { MemberSettingsTabs, QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useUser } from '@/providers/user/user.hooks'

import { MembershipNotifications } from './MembershipNotifications'
import { MembershipPublicProfile } from './MembershipPublicProfile'
import { NoGlobalPaddingWrapper, ScrollWrapper, StyledLimitedWidthContainer } from './MembershipSettingsView.styles'
import { MembershipWallet } from './MembershipWallet'

const TABS: MemberSettingsTabs[] = ['Public profile', 'Wallet', 'Notifications']

export const MembershipSettingsView: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentTab, setCurrentTab] = useState<number>(0)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const { activeMembership } = useUser()
  const currentTabName = searchParams.get(QUERY_PARAMS.TAB) as MemberSettingsTabs | null

  // At mount set the tab from the search params
  const initialRender = useRef(true)
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      const tabIndex = TABS.findIndex((t) => t === currentTabName)
      if (tabIndex >= 0) return setCurrentTab(tabIndex)

      setSearchParams({ tab: TABS[0] }, { replace: true })
      setCurrentTab(0)
    }
  }, [currentTabName, setSearchParams])

  const [openUnsavedChangesDialog, closeUnsavedChangesDialog] = useConfirmationModal()

  const handleOpenUnsavedChangesDialog = useCallback(
    (primaryButtonProps: DialogButtonProps) => {
      openUnsavedChangesDialog({
        title: 'Discard changes?',
        description:
          'You have unsaved changes which are going to be lost if you change the tab. Are you sure you want to continue?',
        type: 'warning',
        primaryButton: primaryButtonProps,
        secondaryButton: {
          text: 'Cancel',
          onClick: () => closeUnsavedChangesDialog(),
        },
      })
    },
    [closeUnsavedChangesDialog, openUnsavedChangesDialog]
  )

  const handleChangeTab = useCallback(
    (idx: number) => {
      if (isFormDirty) {
        handleOpenUnsavedChangesDialog({
          text: 'Discard changes',
          onClick: () => {
            closeUnsavedChangesDialog()
            setIsFormDirty(false)
            setCurrentTab(idx)
          },
        })
      } else {
        setCurrentTab(idx)
      }
    },
    [closeUnsavedChangesDialog, handleOpenUnsavedChangesDialog, isFormDirty]
  )

  return (
    <NoGlobalPaddingWrapper>
      <PageTabs
        tabs={TABS.map((tab) => ({ name: tab }))}
        onSelectTab={handleChangeTab}
        selected={currentTab}
        backAction={{
          to: !isFormDirty ? absoluteRoutes.viewer.member(activeMembership?.handle) : undefined,
          onClick: isFormDirty
            ? () =>
                handleOpenUnsavedChangesDialog({
                  text: 'Discard changes',
                  to: absoluteRoutes.viewer.member(activeMembership?.handle),
                  onClick: () => {
                    closeUnsavedChangesDialog()
                  },
                })
            : undefined,
        }}
      />
      <ScrollWrapper>
        <StyledLimitedWidthContainer>
          {currentTab === 0 && (
            <MembershipPublicProfile
              onDirty={setIsFormDirty}
              onOpenUnsavedChangesDialog={handleOpenUnsavedChangesDialog}
              onCloseUnsavedChangesDialog={closeUnsavedChangesDialog}
            />
          )}
          {currentTab === 1 && <MembershipWallet />}
          {currentTab === 2 && <MembershipNotifications />}
        </StyledLimitedWidthContainer>
      </ScrollWrapper>
    </NoGlobalPaddingWrapper>
  )
}

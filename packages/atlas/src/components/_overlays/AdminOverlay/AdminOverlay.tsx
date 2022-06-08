import React, { useEffect, useState } from 'react'

import { TabItem } from '@/components/Tabs'
import { Button } from '@/components/_buttons/Button'
import { SvgActionClose, SvgActionNewTab, SvgAlertsWarning24 } from '@/components/_icons'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { Select } from '@/components/_inputs/Select'
import { availableNodes } from '@/config/availableNodes'
import { BUILD_ENV, availableEnvs } from '@/config/envs'
import { absoluteRoutes } from '@/config/routes'
import { NODE_URL } from '@/config/urls'
import { useEnvironmentStore } from '@/providers/environment'
import { useSnackbar } from '@/providers/snackbars'
// explicitly import from 'user/store' file to not pull in Polkadot dependencies of ActiveUserContext
import { ActiveUserState, useActiveUserStore } from '@/providers/user/store'
import { SentryLogger } from '@/utils/logs'

import {
  CloseButton,
  Container,
  CustomNodeUrlWrapper,
  HorizontalSpacedContainer,
  StyledTabs,
  VerticalSpacedContainer,
} from './AdminOverlay.styles'

const ENVIRONMENT_NAMES: Record<string, string> = {
  production: 'Main Testnet',
  development: 'Atlas Dev Testnet',
  next: 'Atlas Next Testnet',
}
const environmentsItems = availableEnvs().map((item) => ({ name: ENVIRONMENT_NAMES[item] || item, value: item }))

const TABS: TabItem[] = [{ name: 'Env' }, { name: 'State' }, { name: 'User' }]

export const AdminOverlay: React.FC = () => {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [selectedTabIdx, setSelectedTabIdx] = useState(0)

  useEffect(() => {
    // handle Ctrl+Shift+D keypress
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'D') return

      const control = e.getModifierState('Control')
      const shift = e.getModifierState('Shift')

      if (!control || !shift) return

      setOverlayOpen((currentValue) => !currentValue)
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [])

  const handleCloseClick = () => {
    setOverlayOpen(false)
  }

  const handleTabSelect = (tabIdx: number) => {
    setSelectedTabIdx(tabIdx)
  }

  if (!overlayOpen) {
    return null
  }

  return (
    <Container>
      <CloseButton variant="tertiary" onClick={handleCloseClick} size="small">
        <SvgActionClose />
      </CloseButton>
      <HorizontalSpacedContainer>
        <Button textOnly variant="tertiary" icon={<SvgActionNewTab />} to={absoluteRoutes.viewer.index()}>
          Home
        </Button>
        <Button textOnly variant="tertiary" icon={<SvgActionNewTab />} to={absoluteRoutes.studio.index()}>
          Studio
        </Button>
        <Button textOnly variant="tertiary" icon={<SvgActionNewTab />} to={absoluteRoutes.playground.index()}>
          Playground
        </Button>
      </HorizontalSpacedContainer>
      <StyledTabs tabs={TABS} onSelectTab={handleTabSelect} selected={selectedTabIdx} />
      {selectedTabIdx === 0 && <EnvTab />}
      {selectedTabIdx === 1 && <StateTab />}
      {selectedTabIdx === 2 && <UserTab />}
    </Container>
  )
}

const EnvTab: React.FC = () => {
  const {
    targetDevEnv,
    nodeOverride,
    actions: { setTargetDevEnv, setNodeOverride },
  } = useEnvironmentStore()

  const determinedNode = nodeOverride || NODE_URL
  const determinedNodeFound = availableNodes.find((node) => node.value === determinedNode)
  const [usingCustomNodeUrl, setUsingCustomNodeUrl] = useState(!determinedNodeFound)
  const [customNodeUrl, setCustomNodeUrl] = useState(determinedNode)
  const resetActiveUser = useActiveUserStore((state) => state.actions.resetActiveUser)

  const handleEnvironmentChange = (value?: string | null) => {
    if (!value) {
      return
    }
    setTargetDevEnv(value)
    setNodeOverride(null)
    resetActiveUser()

    window.location.reload()
  }

  const handleNodeChange = (value?: string | null) => {
    setNodeOverride(value ?? null)
    window.location.reload()
  }

  const handleCustomNodeCheckboxChange = () => {
    if (usingCustomNodeUrl) {
      setUsingCustomNodeUrl(false)
      setNodeOverride(null)
    } else {
      setUsingCustomNodeUrl(true)
      setCustomNodeUrl(determinedNode)
    }
  }

  const handleCustomNodeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomNodeUrl(e.target.value)
  }

  const handleSaveCustomNodeUrlClick = () => {
    setNodeOverride(customNodeUrl)
  }

  return (
    <VerticalSpacedContainer>
      <FormField label="Chain">
        <Select
          items={environmentsItems}
          onChange={handleEnvironmentChange}
          value={targetDevEnv}
          disabled={BUILD_ENV === 'production'}
        />
      </FormField>

      <FormField label="Node">
        <Checkbox label="Custom node URL" value={usingCustomNodeUrl} onChange={handleCustomNodeCheckboxChange} />
        {!usingCustomNodeUrl ? (
          <Select items={availableNodes} onChange={handleNodeChange} value={determinedNode} />
        ) : (
          <CustomNodeUrlWrapper>
            <Input value={customNodeUrl} onChange={handleCustomNodeUrlChange} />
            <Button onClick={handleSaveCustomNodeUrlClick} size="large">
              Save
            </Button>
          </CustomNodeUrlWrapper>
        )}
      </FormField>
    </VerticalSpacedContainer>
  )
}

const StateTab: React.FC = () => {
  const { displaySnackbar } = useSnackbar()

  const handleExportClick = () => {
    const storageKeys = Object.keys(window.localStorage)
    const storage = storageKeys.reduce((acc, key) => {
      const rawValue = window.localStorage.getItem(key)
      if (rawValue) {
        try {
          acc[key] = JSON.parse(rawValue)
        } catch (e) {
          acc[key] = rawValue
        }
      }

      return acc
    }, {} as Record<string, unknown>)
    const jsonStorage = JSON.stringify(storage)

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonStorage))
    linkElement.setAttribute('download', `atlas-export-${new Date().toISOString()}.json`)
    linkElement.click()
  }

  const handleFileChange = async (e: Event) => {
    try {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const fileText = await file.text()
      const storage = JSON.parse(fileText)
      Object.keys(storage).forEach((key) => {
        window.localStorage.setItem(key, JSON.stringify(storage[key]))
      })
      displaySnackbar({
        title: 'Local state updated',
        iconType: 'success',
      })
    } catch (error) {
      SentryLogger.error('Failed to import local state', 'AdminOverlay', error)
      displaySnackbar({
        title: 'JSON file seems to be corrupted',
        description: 'Please try again with different file',
        iconType: 'error',
      })
    }
  }

  const handleImportClick = () => {
    const inputElement = document.createElement('input')
    inputElement.setAttribute('type', 'file')
    inputElement.onchange = handleFileChange
    inputElement.click()
  }

  return (
    <VerticalSpacedContainer>
      <Button onClick={handleExportClick} variant="secondary" size="large">
        Export local state
      </Button>
      <Button onClick={handleImportClick} variant="secondary" size="large" icon={<SvgAlertsWarning24 />}>
        Import local state
      </Button>
    </VerticalSpacedContainer>
  )
}

const UserTab: React.FC = () => {
  const {
    accountId,
    memberId,
    channelId,
    actions: { setActiveUser, resetActiveUser },
  } = useActiveUserStore()

  const [accountIdValue, setAccountIdValue] = useState(accountId)
  const [memberIdValue, setMemberIdValue] = useState(memberId)
  const [channelIdValue, setChannelIdValue] = useState(channelId)

  useEffect(() => {
    const handler = (state: ActiveUserState) => {
      setAccountIdValue(state.accountId)
      setMemberIdValue(state.memberId)
      setChannelIdValue(state.channelId)
    }
    return useActiveUserStore.subscribe(handler)
  }, [])

  const handleAccountIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountIdValue(e.target.value)
  }

  const handleMemberIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberIdValue(e.target.value)
  }

  const handleChannelIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelIdValue(e.target.value)
  }

  const handleSaveClick = () => {
    setActiveUser({
      accountId: accountIdValue,
      memberId: memberIdValue,
      channelId: channelIdValue,
    })
  }

  const handleRestClick = () => {
    resetActiveUser()
  }

  return (
    <VerticalSpacedContainer>
      <HorizontalSpacedContainer>
        <FormField label="Account ID">
          <Input value={accountIdValue || ''} onChange={handleAccountIdChange} />
        </FormField>
        <FormField label="Member ID">
          <Input value={memberIdValue || ''} onChange={handleMemberIdChange} />
        </FormField>
        <FormField label="Channel ID">
          <Input value={channelIdValue || ''} onChange={handleChannelIdChange} />
        </FormField>
      </HorizontalSpacedContainer>
      <Button onClick={handleSaveClick} size="large" variant="secondary">
        Save changes
      </Button>
      <Button onClick={handleRestClick} size="large" variant="secondary">
        Reset user
      </Button>
    </VerticalSpacedContainer>
  )
}

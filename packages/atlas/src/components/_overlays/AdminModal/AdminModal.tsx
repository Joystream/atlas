import { ChangeEvent, FC, useEffect, useState } from 'react'

import packageJson from '@/../package.json'
import { useGetKillSwitch, useSetKillSwitch } from '@/api/hooks/admin'
import { SvgActionNewTab, SvgAlertsError24, SvgAlertsWarning24 } from '@/assets/icons'
import { Information } from '@/components/Information'
import { TabItem, Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { Button, TextButton } from '@/components/_buttons/Button'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { Select } from '@/components/_inputs/Select'
import { Switch } from '@/components/_inputs/Switch'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { ENV_SELECTION_ENABLED, NODE_URL, availableEnvs } from '@/config/env'
import { absoluteRoutes } from '@/config/routes'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useEnvironmentStore } from '@/providers/environment'
import { useSnackbar } from '@/providers/snackbars'
import { useUserStore } from '@/providers/user/user.store'
import { ActiveUserState } from '@/providers/user/user.types'
import { useUserLocationStore } from '@/providers/userLocation'
import { SentryLogger } from '@/utils/logs'

import {
  CustomNodeUrlWrapper,
  HorizontalSpacedContainer,
  VersionText,
  VerticalSpacedContainer,
} from './AdminModal.styles'

const ENVIRONMENT_NAMES: Record<string, string> = {
  production: 'Joystream Mainnet',
  development: `${atlasConfig.general.appName} Dev Testnet`,
  next: `${atlasConfig.general.appName} Next Testnet`,
  // todo for removal, created only for testing purposes
  orion2test: `${atlasConfig.general.appName} Orion v2 production Testnet`,
  local: 'Local chain',
}

const AVAILABLE_NODES = [
  {
    name: 'Jsgenesis (Europe/Germany - High Availability)',
    value: import.meta.env.VITE_PRODUCTION_NODE_URL as string,
  },
  ...atlasConfig.joystream.alternativeNodes.map((node) => ({ name: node.name, value: node.url })),
  {
    name: 'Atlas Dev',
    value: import.meta.env.VITE_DEVELOPMENT_NODE_URL as string,
  },
  {
    name: 'Atlas Next',
    value: import.meta.env.VITE_NEXT_NODE_URL as string,
  },
]

const environmentsItems = availableEnvs()
  .filter((item) => ENVIRONMENT_NAMES[item])
  .map((item) => ({ name: ENVIRONMENT_NAMES[item], value: item }))

const TABS: TabItem[] = [
  { name: 'Environment' },
  { name: 'Local state' },
  { name: 'User' },
  { name: 'Location' },
  { name: 'Kill switch' },
]

export const AdminModal: FC = () => {
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

  return (
    <DialogModal
      show={overlayOpen}
      onClickOutside={handleCloseClick}
      onExitClick={handleCloseClick}
      title={
        <HorizontalSpacedContainer>
          <TextButton variant="tertiary" icon={<SvgActionNewTab />} to={absoluteRoutes.viewer.index()}>
            Home
          </TextButton>
          <TextButton variant="tertiary" icon={<SvgActionNewTab />} to={absoluteRoutes.studio.index()}>
            Studio
          </TextButton>
          <TextButton variant="tertiary" icon={<SvgActionNewTab />} to={absoluteRoutes.playground.index()}>
            Playground
          </TextButton>
        </HorizontalSpacedContainer>
      }
    >
      <Tabs tabs={TABS} onSelectTab={handleTabSelect} selected={selectedTabIdx} />
      {selectedTabIdx === 0 && <EnvTab />}
      {selectedTabIdx === 1 && <StateTab />}
      {selectedTabIdx === 2 && <UserTab />}
      {selectedTabIdx === 3 && <LocationTab />}
      {selectedTabIdx === 4 && <KillSwitch />}
      <VersionText variant="t200" as="p">
        Built on Atlas v{packageJson.version}
      </VersionText>
    </DialogModal>
  )
}

const EnvTab: FC = () => {
  const {
    targetDevEnv,
    nodeOverride,
    actions: { setTargetDevEnv, setNodeOverride },
  } = useEnvironmentStore()

  const determinedNode = nodeOverride || NODE_URL
  const determinedNodeFound = AVAILABLE_NODES.find((node) => node.value === determinedNode)
  const [usingCustomNodeUrl, setUsingCustomNodeUrl] = useState(!determinedNodeFound)
  const [customNodeUrl, setCustomNodeUrl] = useState(determinedNode)
  const resetActiveUser = useUserStore((state) => state.actions.resetActiveUser)

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

  const handleCustomNodeUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomNodeUrl(e.target.value)
  }

  const handleSaveCustomNodeUrlClick = () => {
    setNodeOverride(customNodeUrl)
  }

  return (
    <VerticalSpacedContainer>
      <FormField label="Environment">
        <Select
          items={environmentsItems}
          onChange={handleEnvironmentChange}
          value={targetDevEnv}
          disabled={!ENV_SELECTION_ENABLED}
        />
      </FormField>

      <FormField label="Node">
        <Checkbox label="Custom node URL" value={usingCustomNodeUrl} onChange={handleCustomNodeCheckboxChange} />
        {!usingCustomNodeUrl ? (
          <Select items={AVAILABLE_NODES} onChange={handleNodeChange} value={determinedNode} />
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

const StateTab: FC = () => {
  const { displaySnackbar } = useSnackbar()
  const [openModal, closeModal] = useConfirmationModal()

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
    linkElement.setAttribute(
      'download',
      `${atlasConfig.general.appName.toLowerCase()}-export-${new Date().toISOString()}.json`
    )
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
      SentryLogger.error('Failed to import local state', 'AdminModal', error)
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

  const handleClearClick = () => {
    openModal({
      type: 'destructive',
      title: 'Clear local state?',
      description:
        'Cleaning local state will remove all your personal data, including watched videos, followed channels, video drafts and more. This will not impact ownership of your accounts.',
      primaryButton: {
        text: 'Clear',
        onClick: () => {
          window.localStorage.clear()
          window.location.reload()
          closeModal()
        },
      },
      secondaryButton: {
        text: 'Cancel',
        onClick: () => closeModal(),
      },
    })
  }

  return (
    <VerticalSpacedContainer>
      <Button onClick={handleExportClick} variant="secondary" size="large">
        Export local state
      </Button>
      <Button onClick={handleImportClick} variant="secondary" size="large" icon={<SvgAlertsWarning24 />}>
        Import local state
      </Button>
      <Button onClick={handleClearClick} variant="secondary" size="large" icon={<SvgAlertsError24 />}>
        Clear local state
      </Button>
    </VerticalSpacedContainer>
  )
}

const UserTab: FC = () => {
  const {
    accountId,
    memberId,
    channelId,
    actions: { setActiveUser, resetActiveUser },
  } = useUserStore()

  const [accountIdValue, setAccountIdValue] = useState(accountId)
  const [memberIdValue, setMemberIdValue] = useState(memberId)
  const [channelIdValue, setChannelIdValue] = useState(channelId)

  useEffect(() => {
    const handler = (state: ActiveUserState) => {
      setAccountIdValue(state.accountId)
      setMemberIdValue(state.memberId)
      setChannelIdValue(state.channelId)
    }
    return useUserStore.subscribe(handler)
  }, [])

  const handleAccountIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAccountIdValue(e.target.value)
  }

  const handleMemberIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMemberIdValue(e.target.value)
  }

  const handleChannelIdChange = (e: ChangeEvent<HTMLInputElement>) => {
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

const LocationTab: FC = () => {
  const {
    coordinates,
    disableUserLocation,
    actions: { setDisableUserLocation, setUserLocation, resetUserLocation },
  } = useUserLocationStore()

  const [latValue, setLatValue] = useState(coordinates?.latitude ?? null)
  const [longValue, setLongValue] = useState(coordinates?.longitude ?? null)

  const { displaySnackbar } = useSnackbar()

  const handleLatChange = (e: ChangeEvent<HTMLInputElement>) => {
    const valueAsNumber = parseFloat(e.target.value)
    if (!Number.isNaN(valueAsNumber)) {
      setLatValue(valueAsNumber)
    } else {
      setLatValue(null)
    }
  }

  const handleLongChange = (e: ChangeEvent<HTMLInputElement>) => {
    const valueAsNumber = parseFloat(e.target.value)
    if (!Number.isNaN(valueAsNumber)) {
      setLongValue(valueAsNumber)
    } else {
      setLongValue(null)
    }
  }

  const handleSaveClick = () => {
    if (latValue && longValue) {
      setUserLocation({
        latitude: latValue,
        longitude: longValue,
      })
      displaySnackbar({
        title: 'Location saved',
        iconType: 'success',
        timeout: 5000,
      })
    } else {
      displaySnackbar({
        title: 'Location not saved',
        description: 'Incorrect values were provided',
        iconType: 'error',
      })
    }
  }

  const handleResetClick = () => {
    resetUserLocation()
    setLongValue(null)
    setLatValue(null)
  }

  const handleDisableChange = () => {
    setDisableUserLocation(!disableUserLocation)
    setLongValue(null)
    setLatValue(null)
  }

  const isGeolocationServiceUrlProvided = !!atlasConfig.storage.geolocationServiceUrl

  return (
    <VerticalSpacedContainer>
      {!isGeolocationServiceUrlProvided && (
        <Text color="colorTextError" variant="t100" as="p">
          Warning! Setting up location data is unavailable, because geolocation service url wasn't provided.
        </Text>
      )}
      <FormField description="User location is used to determine nearest storage operators to ensure best user experience. This data is never sent outside of your browser and not used for any additional purposes. We highly recommend leaving this enabled.">
        <Switch
          label="Use location data"
          value={isGeolocationServiceUrlProvided ? !disableUserLocation : false}
          onChange={handleDisableChange}
          disabled={!isGeolocationServiceUrlProvided}
        />
      </FormField>
      <HorizontalSpacedContainer>
        <FormField label="Latitude">
          <Input
            value={latValue || ''}
            onChange={handleLatChange}
            type="number"
            disabled={!isGeolocationServiceUrlProvided}
          />
        </FormField>
        <FormField label="Longitude">
          <Input
            value={longValue || ''}
            onChange={handleLongChange}
            type="number"
            disabled={!isGeolocationServiceUrlProvided}
          />
        </FormField>
      </HorizontalSpacedContainer>
      <Button onClick={handleSaveClick} size="large" variant="secondary" disabled={!isGeolocationServiceUrlProvided}>
        Save changes
      </Button>
      <Button onClick={handleResetClick} size="large" variant="secondary" disabled={!isGeolocationServiceUrlProvided}>
        Reset location data{' '}
        <Information text="Resetting will cause the app to fetch your location again on next startup" />
      </Button>
    </VerticalSpacedContainer>
  )
}

const KillSwitch: FC = () => {
  const [secret, setSecret] = useState('')
  const [isKilledSwitch, setIsKilledSwitch] = useState(false)
  const { setKillSwitch, error } = useSetKillSwitch()
  const { isKilled, loading } = useGetKillSwitch()

  useEffect(() => {
    if (isKilled) {
      setIsKilledSwitch(isKilled)
    }
  }, [isKilled])

  const handleKillSwitch = async () => {
    await setKillSwitch(isKilledSwitch, secret)
    window.location.reload()
  }

  return (
    <VerticalSpacedContainer>
      <FormField>
        <Switch
          disabled={loading}
          label="Kill instance"
          value={isKilledSwitch}
          onChange={() => setIsKilledSwitch((prevState) => !prevState)}
        />
      </FormField>
      <FormField label="Secret" error={error ? error.message : undefined}>
        <Input value={secret} onChange={(event) => setSecret(event.target.value)} type="text" error={!!error} />
      </FormField>
      <Button disabled={!secret.length} onClick={handleKillSwitch} size="large" variant="secondary">
        Save changes
      </Button>
    </VerticalSpacedContainer>
  )
}

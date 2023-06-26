import { FC, ReactNode, useCallback, useState } from 'react'

import { SvgActionCopy, SvgActionDownload, SvgActionEdit } from '@/assets/icons'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { EntitySettingTemplate } from '@/components/_templates/EntitySettingTemplate'
import { useClipboard } from '@/hooks/useClipboard'
import { useAuth } from '@/providers/auth/auth.hooks'

import {
  ChangePasswordButton,
  FormFieldsWrapper,
  StyledAnchor,
  UnEditableInput,
  WalletStepListItem,
  WalletStepsOrderedList,
} from './MembershipWallet.styles'

import { ChangePasswordDialog } from '../ChangePasswordDialog'
import { ExportSeedDialog } from '../ExportSeedDialog'

const CONNECTING_WALLET_STEPS: WalletStepListItemComponentProps[] = [
  {
    title: 'Install wallet (signer) browser extension of your choice',
    description: (
      <>
        It can be any wallet supporting polkadot account like:{' '}
        <StyledAnchor href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer">
          Polkadot.js
        </StyledAnchor>
        ,{' '}
        <StyledAnchor href="https://www.talisman.xyz/" target="_blank" rel="noopener noreferrer">
          Talisman
        </StyledAnchor>
        ,{' '}
        <StyledAnchor href="https://www.subwallet.app/download.html" target="_blank" rel="noopener noreferrer">
          Subwallet
        </StyledAnchor>{' '}
        etc.
      </>
    ),
  },
  {
    title: 'Export your wallet seed',
    description: 'Use the export seed button above to export your seed',
  },
  {
    title: 'Import your seed to external wallet',
    description: 'Find the option to add polkadot account using the seed.',
  },
  {
    title: 'Success',
    description: 'From now you can log in to your account with your external wallet on other Apps but also to Gleev.',
  },
]

export const MembershipWallet = () => {
  const [isCopyClicked, setIsCopyClicked] = useState(false)
  const { copyToClipboard } = useClipboard()
  const { currentUser, isWalletUser } = useAuth()
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false)
  const [isExportSeedDialogOpen, setIsExportSeedDialogOpen] = useState(false)
  const handleCopyToClipBoard = useCallback(() => {
    if (!currentUser?.joystreamAccount) {
      return
    }
    setIsCopyClicked(true)
    copyToClipboard(currentUser?.joystreamAccount)
  }, [copyToClipboard, currentUser?.joystreamAccount])
  return (
    <>
      {!isWalletUser && (
        <>
          <ExportSeedDialog onClose={() => setIsExportSeedDialogOpen(false)} show={isExportSeedDialogOpen} />
          <ChangePasswordDialog
            onClose={() => setIsChangePasswordDialogOpen(false)}
            show={isChangePasswordDialogOpen}
          />
        </>
      )}
      <EntitySettingTemplate
        isFirst
        title="Membership address"
        description="When your public membership was created, it was linked to a new substrate account address built on polkadot protocol. This account holds all assets like tokens and NFTs that your membership accumulates. "
      >
        <FormFieldsWrapper>
          <FormField label="Membership address">
            <UnEditableInput
              disabled
              defaultValue={currentUser?.joystreamAccount}
              disabledAttributeOnly
              actionButton={{
                icon: <SvgActionCopy />,
                disabled: false,
                onMouseLeave: () => setIsCopyClicked(false),
                tooltipText: isCopyClicked ? 'Copied' : 'Copy',
                onClick: handleCopyToClipBoard,
                dontFocusOnClick: true,
              }}
            />
          </FormField>
          {!isWalletUser && (
            <FormField
              tooltip={{
                multiline: true,
                text: 'Wallet seed can be used to restore your account in case if you loose your password',
              }}
              label="Wallet seed"
              description="You can access your wallet outside of our app, for example in an external signer wallet using your wallet seed. Keep your seed a secret."
            >
              <Button
                icon={<SvgActionDownload />}
                variant="secondary"
                size="large"
                onClick={() => {
                  setIsExportSeedDialogOpen(true)
                }}
              >
                Export seed
              </Button>
            </FormField>
          )}
        </FormFieldsWrapper>
      </EntitySettingTemplate>
      <EntitySettingTemplate
        isLast={isWalletUser}
        title="Login credentials"
        description="We encrypt your password and won't share your private data with anyone."
      >
        <FormFieldsWrapper>
          <FormField label="Email address">
            <UnEditableInput disabled disabledAttributeOnly defaultValue={currentUser?.email} />
          </FormField>
          {!isWalletUser && (
            <FormField label="Password">
              <UnEditableInput disabled disabledAttributeOnly type="password" defaultValue="*********" />
            </FormField>
          )}
        </FormFieldsWrapper>
        {!isWalletUser && (
          <ChangePasswordButton
            icon={<SvgActionEdit />}
            variant="secondary"
            size="large"
            onClick={() => setIsChangePasswordDialogOpen(true)}
          >
            Change password
          </ChangePasswordButton>
        )}
      </EntitySettingTemplate>
      {!isWalletUser && (
        <EntitySettingTemplate
          isLast
          title="External wallet"
          description="You can use external wallet to log in to your account."
        >
          <FormField
            label="Connect external wallet"
            description="Connecting external wallet allows you to access your assets like NFTs and Tokens outside of our app and login to other Apps connected to Joystream Network."
          >
            <WalletStepsOrderedList>
              {CONNECTING_WALLET_STEPS.map(({ title, description }, idx) => (
                <WalletStepListItemComponent key={idx} title={title} description={description} />
              ))}
            </WalletStepsOrderedList>
          </FormField>
        </EntitySettingTemplate>
      )}
    </>
  )
}

type WalletStepListItemComponentProps = {
  title: string
  description: ReactNode
}

const WalletStepListItemComponent: FC<WalletStepListItemComponentProps> = ({ title, description }) => {
  return (
    <WalletStepListItem>
      <div>
        <Text as="p" variant="h200">
          {title}
        </Text>
        <Text as="p" variant="t200" color="colorText" margin={{ top: 1 }}>
          {description}
        </Text>
      </div>
    </WalletStepListItem>
  )
}

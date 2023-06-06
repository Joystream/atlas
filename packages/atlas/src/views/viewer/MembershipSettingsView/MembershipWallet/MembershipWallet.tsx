import { SvgActionDownload, SvgActionEdit } from '@/assets/icons'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'

import { ChangePasswordButton, FormFieldsWrapper } from './MembershipWallet.styles'

import { MembershipSettingTemplate } from '../MembershipSettingTemplate'

export const MembershipWallet = () => {
  return (
    <>
      <MembershipSettingTemplate
        title="Membership address"
        description="When your public membership was created, it was linked to a new substrate account address built on polkadot protocol.  This account holds all assets like tokens and NFTs that your membership accumulates. "
      >
        <FormFieldsWrapper>
          <FormField label="Membership address">
            <Input disabled />
          </FormField>
          <FormField
            tooltip={{
              multiline: true,
              text: 'Wallet seed can be used to restore your account in case if you loose your password',
            }}
            label="Wallet seed"
            description="You can access your wallet outside of our app, for example in an external signer wallet using your wallet seed. Keep your seed a secret."
          >
            <Button icon={<SvgActionDownload />} variant="secondary" size="large">
              Export seed
            </Button>
          </FormField>
        </FormFieldsWrapper>
      </MembershipSettingTemplate>
      <MembershipSettingTemplate
        title="Login credentials"
        description="We encrypt your password and won't share your private data with anyone."
      >
        <FormFieldsWrapper>
          <FormField label="Email address">
            <Input disabled value="user@email.com" />
          </FormField>
          <FormField label="Password">
            <Input disabled value="***********" />
          </FormField>
        </FormFieldsWrapper>
        <ChangePasswordButton icon={<SvgActionEdit />} variant="secondary" size="large">
          Change password
        </ChangePasswordButton>
      </MembershipSettingTemplate>
      <MembershipSettingTemplate
        title="External wallet"
        description="You can use external wallet to log in to your account."
      >
        <FormField
          label="Connect external wallet"
          description="Connecting external wallet allows you to access your assets like NFTs and Tokens outside of our app and login to other Apps connected to Joystream Network."
        >
          <ul>
            <ol>
              <Text>Install wallet (signer) browser extension of your choice</Text>
            </ol>
            <ol>Export your wallet seed</ol>
            <ol>Import your seed to external wallet</ol>
            <ol>Success</ol>
          </ul>
        </FormField>
      </MembershipSettingTemplate>
    </>
  )
}

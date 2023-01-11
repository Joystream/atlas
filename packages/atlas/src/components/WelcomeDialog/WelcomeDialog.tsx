import { AppKV } from '@/components/AppKV/AppKV'
import { Button } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { usePersonalDataStore } from '@/providers/personalData'

import { ContentText, Divider, StyledAnchor, StyledDialogModal, StyledText, Wrapper } from './WelcomeDialog.styles'

export const WelcomeDialog = () => {
  const { isCookiesPopoverVisible, setCookiesAccepted } = usePersonalDataStore((state) => ({
    isCookiesPopoverVisible: state.actions.getIsCookiesPopoverVisible(),
    setCookiesAccepted: state.actions.setCookiesAccepted,
  }))
  return (
    <StyledDialogModal
      show={isCookiesPopoverVisible && !!atlasConfig.general.appContentFocus}
      contentClassName="welcome-content"
      size="small"
    >
      <Wrapper>
        <AppKV />
        <StyledText variant="h500" as="p" color="colorTextStrong">
          Welcome to {atlasConfig.general.appName}
        </StyledText>
        <StyledText variant="t200" as="span" color="colorText">
          {atlasConfig.general.appName} is a{' '}
          <ContentText as="p" variant="t200-strong" color="colorTextStrong">
            {atlasConfig.general.appContentFocus}
          </ContentText>{' '}
          content-focused video platform that's part of the Joystream ecosystem.
        </StyledText>
        <StyledText variant="t200" as="span" color="colorText">
          We use cookies and other tracking technologies to improve your experience and provide analytics.
          <br />{' '}
          <StyledAnchor to={absoluteRoutes.legal.privacyPolicy()} target="_blank">
            Find out more.
          </StyledAnchor>
        </StyledText>
        <Divider />
        <Button onClick={() => setCookiesAccepted(true)}>Accept all cookies</Button>
        <Button onClick={() => setCookiesAccepted(false)} variant="secondary">
          Refuse non-essential cookies
        </Button>
      </Wrapper>
    </StyledDialogModal>
  )
}

import { useNavigate } from 'react-router-dom'
import shallow from 'zustand/shallow'

import { SvgActionAddChannel, SvgActionNewChannel } from '@/assets/icons'
import ListImage from '@/assets/images/referrals-list.webp'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useUser } from '@/providers/user/user.hooks'
import {
  ImageContainer,
  StyledContentGrid,
  StyledListContainer,
  StyledScrollingListImage,
  TextContainer,
} from '@/views/global/ReferralsView/sections/ReferralsList/ReferralsList.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

export const ReferralsList = () => {
  const [titleVariant, subtitleVariant, _] = useSectionTextVariants()
  const { activeMembership, activeChannel } = useUser()
  const navigate = useNavigate()
  const { setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )
  const smMatch = useMediaMatch('sm')

  const handleActionButtonClick = () => {
    if (activeChannel?.id) {
      navigate(absoluteRoutes.studio.yppDashboard())
    } else if (activeMembership?.id) {
      setAuthModalOpenName('createChannel')
    } else {
      setAuthModalOpenName('createChannel')
    }
  }

  return (
    <StyledListContainer>
      <StyledContentGrid>
        <GridItem colSpan={{ base: 12, sm: 5 }} colStart={{ base: 1 }}>
          <ImageContainer>
            <StyledScrollingListImage src={ListImage} />
          </ImageContainer>
        </GridItem>
        <GridItem colSpan={{ base: 12, sm: 6 }} colStart={{ base: 1, sm: 7 }}>
          <TextContainer justifyContent="center" flow="column" gap={6}>
            <Text color="colorTextStrong" variant={titleVariant} as="h2">
              Ready to start?
            </Text>
            <Text align="left" color="colorText" variant={subtitleVariant} as="h2">
              Sign in or create an account to start referring creators.
            </Text>
            <Button
              icon={
                activeChannel?.id ? undefined : activeMembership?.id ? <SvgActionAddChannel /> : <SvgActionNewChannel />
              }
              onClick={handleActionButtonClick}
              variant="secondary"
              fullWidth={!smMatch}
            >
              {activeChannel?.id ? 'Open referrals dashboard' : activeMembership?.id ? 'Add new channel' : 'Sign in'}
            </Button>
          </TextContainer>
        </GridItem>
      </StyledContentGrid>
    </StyledListContainer>
  )
}

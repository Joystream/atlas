import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import shallow from 'zustand/shallow'

import { SvgActionAddChannel, SvgActionNewChannel } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Step } from '@/components/_referrals/Step/Step'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useUser } from '@/providers/user/user.hooks'
import {
  StepVideoContainer,
  StyledCtaButton,
  StyledLayoutGrid,
  StyledStepVideo,
  StyledStepsContainer,
} from '@/views/global/ReferralsView/sections/ReferralSteps/ReferralSteps.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

export const ReferralSteps = () => {
  const xsMatch = useMediaMatch('xs')
  const mdMatch = useMediaMatch('md')
  const lgMatch = useMediaMatch('lg')
  const navigate = useNavigate()
  const { setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )

  const steps = [
    `Sign up to ${atlasConfig.general.appName}`,
    `Create ${atlasConfig.general.appName} channel`,
    'Copy and share referral link',
  ]

  const videoSrcs = [
    'https://eu-central-1.linodeobjects.com/atlas-assets/categories/gleev/videos/referrals/Sign_in.mp4',
    'https://eu-central-1.linodeobjects.com/atlas-assets/categories/gleev/videos/referrals/Create_channel.mp4',
    'https://eu-central-1.linodeobjects.com/atlas-assets/categories/gleev/videos/referrals/Copy_link.mp4',
  ]

  const { activeMembership, activeChannel } = useUser()

  const shouldSwitch = useRef<boolean>(true)
  const minStep = activeChannel?.id ? 2 : activeMembership?.id ? 1 : 0
  const [selectedStep, setSelectedStep] = useState(minStep)
  const smMatch = useMediaMatch('sm')

  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const switchInterval = setInterval(() => {
      if (shouldSwitch.current && selectedStep >= minStep) {
        setSelectedStep(selectedStep === steps.length - 1 ? minStep : selectedStep + 1)
      }
    }, 7000)

    return () => {
      clearInterval(switchInterval)
    }
  }, [minStep, selectedStep, shouldSwitch, steps.length])

  const [titleVariant, _, __] = useSectionTextVariants()

  useEffect(() => {
    videoRef?.current?.load()
  })
  const handleActionButtonClick = () => {
    if (activeChannel?.id) {
      navigate(`${absoluteRoutes.studio.yppDashboard()}?tab=Referrals`)
    } else if (activeMembership?.id) {
      setAuthModalOpenName('createChannel')
    } else {
      setAuthModalOpenName('signUp')
    }
  }

  return (
    <FlexBox flow="column" alignItems="center" gap={lgMatch ? 18 : mdMatch ? 14 : 12}>
      <Text
        as="h2"
        variant={titleVariant}
        color="colorTextStrong"
        data-aos="fade-up"
        data-aos-delay="350"
        data-aos-offset="40"
        data-aos-easing="atlas-easing"
      >
        How to start
      </Text>
      <StyledLayoutGrid as="article">
        <GridItem
          colSpan={{ base: 12, md: 5, lg: 4 }}
          onMouseEnter={() => (shouldSwitch.current = false)}
          onMouseLeave={() => (shouldSwitch.current = true)}
          colStart={{ lg: 2 }}
        >
          <StyledStepsContainer flow="column" gap={xsMatch ? 6 : 4}>
            {steps.map((step, idx) => (
              <Step
                key={idx}
                stepIdx={idx + 1}
                isSelected={selectedStep === idx}
                title={step}
                onClick={() => setSelectedStep(idx)}
              />
            ))}
          </StyledStepsContainer>
        </GridItem>
        <GridItem
          colSpan={{ base: 12, md: 7, lg: 6 }}
          colStart={{ base: 1, md: 6 }}
          onMouseEnter={() => (shouldSwitch.current = false)}
          onMouseLeave={() => (shouldSwitch.current = true)}
        >
          <StepVideoContainer>
            <StyledStepVideo ref={videoRef} autoPlay loop muted>
              <source src={videoSrcs[selectedStep]} type="video/mp4" />
            </StyledStepVideo>
          </StepVideoContainer>
        </GridItem>
      </StyledLayoutGrid>
      <StyledCtaButton
        icon={activeChannel?.id ? undefined : activeMembership?.id ? <SvgActionAddChannel /> : <SvgActionNewChannel />}
        onClick={handleActionButtonClick}
        size="large"
        fullWidth={!smMatch}
      >
        {activeChannel?.id ? 'Open referrals dashboard' : activeMembership?.id ? 'Add new channel' : 'Sign in'}
      </StyledCtaButton>
    </FlexBox>
  )
}

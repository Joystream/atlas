import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { SvgActionCheck, SvgActionClose, SvgActionNewTab } from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { useSnackbar } from '@/providers/snackbars'

import { ListItem, StyledList, TickWrapper } from './YppAuthorizationRequirementsStep.styles'

type YppAuthorizationRequirementsStepProps = {
  isChannelValid: boolean
}

export const YppAuthorizationRequirementsStep: FC<YppAuthorizationRequirementsStepProps> = ({ isChannelValid }) => {
  const { displaySnackbar } = useSnackbar()
  const navigate = useNavigate()

  const REQUIREMENTS = [
    { text: 'Your Atlas channel avatar, cover image, and description are set', fulfilled: isChannelValid },
    { text: 'Your YouTube channel is at least 3 months old', fulfilled: true },
    { text: 'Your YouTube channel has at least 10 videos, all published at least 1 month ago', fulfilled: true },
    { text: 'Your YouTube channel has at least 50 subscribers', fulfilled: true },
  ]

  // show snackbar if channel doesn't meet requirements
  useEffect(() => {
    if (!isChannelValid) {
      displaySnackbar({
        title: `Your Atlas channel doesn't meet conditions`,
        description:
          'Your Atlas channel must have a custom avatar, cover image, and description set in order to be enrolled in the program.',
        iconType: 'error',
        actionText: 'Edit channel',
        actionIcon: <SvgActionNewTab />,
        actionIconPlacement: 'right',
        onActionClick: () => navigate(absoluteRoutes.studio.editChannel()),
      })
    }
  }, [displaySnackbar, isChannelValid, navigate])

  return (
    <StyledList>
      {REQUIREMENTS.map((item) => (
        <ListItem key={item.text} as="li" variant="t200" color="colorText">
          <TickWrapper fulfilled={item.fulfilled}>
            {item.fulfilled ? <SvgActionCheck /> : <SvgActionClose />}
          </TickWrapper>
          {item.text}
        </ListItem>
      ))}
    </StyledList>
  )
}

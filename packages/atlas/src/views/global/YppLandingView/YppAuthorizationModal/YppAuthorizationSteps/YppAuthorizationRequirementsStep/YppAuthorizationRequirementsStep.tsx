import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { SvgActionCheck, SvgActionClose, SvgActionNewTab } from '@/assets/icons'
import { absoluteRoutes } from '@/config/routes'
import { useSnackbar } from '@/providers/snackbars'

import { ListItem, StyledList, TickWrapper } from './YppAuthorizationRequirementsStep.styles'

type Requirment = {
  text: string
  fulfilled: boolean
}

type YppAuthorizationRequirementsStepProps = {
  requirments: Requirment[]
  isChannelValid: boolean
  onChangeChannel?: () => void
}

export const YppAuthorizationRequirementsStep: FC<YppAuthorizationRequirementsStepProps> = ({
  isChannelValid,
  onChangeChannel,
  requirments,
}) => {
  const { displaySnackbar } = useSnackbar()
  const navigate = useNavigate()

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
        onActionClick: () => {
          onChangeChannel?.()
          navigate(absoluteRoutes.studio.editChannel())
        },
      })
    }
  }, [displaySnackbar, isChannelValid, navigate, onChangeChannel])

  return (
    <StyledList>
      {requirments.map((item) => (
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

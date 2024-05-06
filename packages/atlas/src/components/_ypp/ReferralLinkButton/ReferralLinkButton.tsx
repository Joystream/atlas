import { ButtonProps } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useUser } from '@/providers/user/user.hooks'
import { StyledCopyButton } from '@/views/studio/YppDashboard/tabs/YppDashboardTabs.styles'

export const ReferralLinkButton = (props: { onClick?: () => void } & Omit<ButtonProps, 'to'>) => {
  const { trackReferralLinkGenerated } = useSegmentAnalytics()
  const { channelId } = useUser()
  const smMatch = useMediaMatch('sm')

  return (
    <StyledCopyButton
      {...props}
      fullWidth={!smMatch}
      textToCopy={`${window.location.origin}/ypp?referrerId=${channelId}`}
      copySuccessText="Referral link copied!"
      onClick={props.onClick ? props.onClick : () => trackReferralLinkGenerated(channelId)}
    >
      Copy referral link
    </StyledCopyButton>
  )
}

import { SvgActionLinkUrl } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Button } from '@/components/_buttons/Button'
import { useClipboard } from '@/hooks/useClipboard'
import { useUser } from '@/providers/user/user.hooks'

import { FallbackContainer } from './YppDashboardTabs.styles'

export const YppDashboardReferralsTab = () => {
  const { copyToClipboard } = useClipboard()
  const { channelId } = useUser()
  return (
    <FallbackContainer>
      <EmptyFallback
        title="No referred users yet"
        variant="large"
        subtitle="You will see all referred users here once someone uses your link to sign up to the program."
        button={
          <Button
            variant="secondary"
            icon={<SvgActionLinkUrl />}
            onClick={() =>
              copyToClipboard(
                `${window.location.host}/ypp?referrerId=${channelId}`,
                'Referral link copied to clipboard'
              )
            }
          >
            Copy referral link
          </Button>
        }
      />
    </FallbackContainer>
  )
}

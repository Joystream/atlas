import { SvgActionLinkUrl } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { YppReferralTable } from '@/components/YppReferralTable/YppReferralTable'
import { ReferralLinkButton } from '@/components/_ypp/ReferralLinkButton'
import { useYppReferralPagination } from '@/hooks/useYppReferralPagination'

import { FallbackContainer } from '../YppDashboardTabs.styles'

const TILES_PER_PAGE = 10

export const YppDashboardReferralsTab = () => {
  const { isLoading, yppReferrals, currentPage, setCurrentPage, perPage, setPerPage, totalCount } =
    useYppReferralPagination({ initialPageSize: TILES_PER_PAGE })

  if (!isLoading && totalCount === 0) {
    return (
      <FallbackContainer>
        <EmptyFallback
          title="No referred users yet"
          variant="large"
          subtitle="You will see all referred users here once someone uses your link to sign up to the program."
          button={<ReferralLinkButton variant="secondary" icon={<SvgActionLinkUrl />} />}
        />
      </FallbackContainer>
    )
  }

  return (
    <YppReferralTable
      data={yppReferrals}
      isLoading={isLoading}
      pagination={{ page: currentPage, setPerPage, totalCount, itemsPerPage: perPage, onChangePage: setCurrentPage }}
    />
  )
}

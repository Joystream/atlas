import BN from 'bn.js'
import { ReactElement, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionChevronL, SvgActionNewTab } from '@/assets/icons'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { OutputPill } from '@/components/OutputPill'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { CrtBasicInfoWidget } from '@/components/_crt/CrtBasicInfoWidget'
import { CrtStatusWidget } from '@/components/_crt/CrtStatusWidget'
import { HoldersWidget } from '@/components/_crt/HoldersWidget'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useUser } from '@/providers/user/user.hooks'
import { permillToPercentage } from '@/utils/number'

import {
  FirstColumn,
  HeaderButton,
  HeaderContainer,
  HeaderInnerContainer,
  Placeholder,
  SecondColumn,
  Wrapper,
} from './CrtPreviewLayout.styles'

type CrtPreviewViewProps = {
  mode: 'edit' | 'preview'
  tokenDetails?: ReactElement
  token?: FullCreatorTokenFragment
  isDirty?: boolean
  channelRevenue?: string
  isLoading?: boolean
}

export const getTokenDetails = (token: FullCreatorTokenFragment, cumulativeRevenue?: string) => {
  const details = []
  if (cumulativeRevenue)
    details.push({
      caption: 'TOTAL REV.',
      content: new BN(cumulativeRevenue),
      icon: <JoyTokenIcon size={16} variant="silver" />,
      tooltipText: 'Total cumulative revenue of this channel on Joystream to date.',
      withDenomination: true,
    })

  if (token.revenueShareRatioPermill)
    details.push({
      caption: 'REV. SHARE',
      content: `${permillToPercentage(token.revenueShareRatioPermill)}%`,
      tooltipText: `Percentage of the future revenue that channel shares with token holders. Each token holder can claim amount of revenue proportionate to their ownership of the channel tokens supply.`,
    })

  if (token.annualCreatorRewardPermill)
    details.push({
      caption: 'INFLATION',
      content: `${permillToPercentage(token.annualCreatorRewardPermill)}%`,
      tooltipText:
        'This percentage of the token supply gets minted every year and paid to creator for channel management.',
    })

  if (token.totalSupply)
    details.push({
      caption: 'TOTAL SUPPLY',
      content: +token.totalSupply,
      tooltipText: `Total amount of tokens owned by all holders.`,
      withToken: true,
      customTicker: `$${token.symbol}`,
    })
  return details
}

export const CrtPreviewLayout = ({
  tokenDetails = <Placeholder height={1000}>Token details</Placeholder>,
  mode,
  token,
  isDirty,
  channelRevenue,
  isLoading,
}: CrtPreviewViewProps) => {
  const lgMatch = useMediaMatch('lg')
  const navigate = useNavigate()
  const [openConfirmationModal, closeModal] = useConfirmationModal()
  const { memberId } = useUser()
  const basicDetails = useMemo(() => (token ? getTokenDetails(token, channelRevenue) : []), [token, channelRevenue])

  return (
    <Wrapper>
      <HeaderContainer>
        <Button to={absoluteRoutes.studio.crtDashboard()} icon={<SvgActionChevronL />} variant="tertiary" />
        <HeaderInnerContainer>
          <Text variant="h400" as="p">
            Token page preview
          </Text>
          <OutputPill handle={mode === 'edit' ? 'Edit mode' : 'Preview mode'} />
        </HeaderInnerContainer>
        {lgMatch && (
          <HeaderButton
            variant="tertiary"
            icon={<SvgActionNewTab />}
            iconPlacement="right"
            onClick={() => {
              if (isDirty) {
                openConfirmationModal({
                  title: 'You have unpublished changes',
                  description: 'You need to publish your changes to see them reflected on the token page.',
                  primaryButton: {
                    variant: 'warning',
                    text: 'Confirm and leave',
                    onClick: () => {
                      closeModal()
                      navigate(absoluteRoutes.viewer.channel(token?.channel?.channel.id, { tab: 'Token' }))
                    },
                  },
                  secondaryButton: {
                    text: 'Stay',
                    onClick: () => closeModal(),
                  },
                })
                return
              }
              navigate(absoluteRoutes.viewer.channel(token?.channel?.channel.id, { tab: 'Token' }))
            }}
          >
            See your token
          </HeaderButton>
        )}
      </HeaderContainer>
      <FirstColumn>{tokenDetails}</FirstColumn>
      <SecondColumn>
        {isLoading || !token ? (
          <SkeletonLoader width="100%" height={400} />
        ) : (
          <CrtBasicInfoWidget
            details={basicDetails}
            name={token.symbol ?? 'N/A'}
            symbol={token.symbol ?? 'N/A'}
            avatar={token.channel?.channel.avatarPhoto?.resolvedUrls?.[0]}
            accountsNum={token.accountsNum}
            size={lgMatch ? 'medium' : 'small'}
            description={token.description ?? ''}
          />
        )}
        {/* todo all props below creationDate are incorrect and should be calucated on orion side */}
        {isLoading || !token ? <SkeletonLoader width="100%" height={300} /> : <CrtStatusWidget token={token} />}
        <HoldersWidget
          totalSupply={+(token?.totalSupply ?? 0)}
          totalHolders={token?.accountsNum ?? 0}
          tokenSymbol={token?.symbol ?? ''}
          tokenId={token?.id ?? '-1'}
          ownerId={memberId ?? ''}
        />
      </SecondColumn>
    </Wrapper>
  )
}

import { ReactElement, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { useGetCreatorTokenHoldersQuery } from '@/api/queries/__generated__/creatorTokens.generated'
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
import { SentryLogger } from '@/utils/logs'
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
  token: FullCreatorTokenFragment
  isDirty?: boolean
}

export const getTokenDetails = (token: FullCreatorTokenFragment) => {
  const details = []
  // todo: after resolver is done on orion, redo total rev
  if (token.totalSupply)
    details.push({
      caption: 'TOTAL REV.',
      content: +token.totalSupply,
      icon: <JoyTokenIcon size={16} variant="silver" />,
      tooltipText:
        'This is the total amount of revenue that the channel made from the time it was created. This information can be useful to determine if the creator had high or low income from their content in the past.',
      withDenomination: true,
    })

  if (token.revenueShareRatioPermill)
    details.push({
      caption: 'REV. SHARE',
      content: `${permillToPercentage(token.revenueShareRatioPermill)}%`,
      tooltipText: `This is a percentage of revenue that creator claims after each revenue share - Channel: ${permillToPercentage(
        token.revenueShareRatioPermill
      )}%, Holders: ${100 - permillToPercentage(token.revenueShareRatioPermill)}%.`,
    })

  if (token.annualCreatorRewardPermill)
    details.push({
      caption: 'AN. REWARD',
      content: `${permillToPercentage(token.annualCreatorRewardPermill)}%`,
      tooltipText:
        'This is how much creator will be earning annually from their tokens in % terms from the total supply.',
    })

  if (token.totalSupply)
    details.push({
      caption: 'TOTAL SUPPLY',
      content: +token.totalSupply,
      tooltipText: `This is a total supply of all $${token.symbol} tokens owned by token holders. `,
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
}: CrtPreviewViewProps) => {
  const lgMatch = useMediaMatch('lg')
  const navigate = useNavigate()
  const [openConfirmationModal, closeModal] = useConfirmationModal()
  const { memberId } = useUser()
  const { data } = useGetCreatorTokenHoldersQuery({
    variables: {
      where: {
        token: {
          id_eq: token.id,
        },
        member: {
          id_eq: memberId,
        },
      },
    },
    onError: (error) => {
      SentryLogger.error('Failed to fetch token holders query', 'CrtPreviewLayout', error)
    },
  })

  const basicDetails = useMemo(() => getTokenDetails(token), [token])

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
                      navigate(absoluteRoutes.viewer.channel(token.channel?.channel.id, { tab: 'Token' }))
                    },
                  },
                  secondaryButton: {
                    text: 'Stay',
                    onClick: () => closeModal(),
                  },
                })
                return
              }
              navigate(absoluteRoutes.viewer.channel(token.channel?.channel.id, { tab: 'Token' }))
            }}
          >
            See your token
          </HeaderButton>
        )}
      </HeaderContainer>
      <FirstColumn>{tokenDetails}</FirstColumn>
      <SecondColumn>
        <CrtBasicInfoWidget
          details={basicDetails}
          name={token.symbol ?? 'N/A'}
          symbol={token.symbol ?? 'N/A'}
          avatar={token?.channel?.channel.avatarPhoto?.resolvedUrls?.[0]}
          accountsNum={token?.accountsNum}
          size={lgMatch ? 'large' : 'small'}
          description={token?.description ?? ''}
        />
        {/* todo all props below creationDate are incorrect and should be calucated on orion side */}
        <CrtStatusWidget token={token} />
        {data ? (
          <HoldersWidget totalSupply={+token.totalSupply} holders={data.tokenAccounts} ownerId={memberId ?? ''} />
        ) : (
          <SkeletonLoader width="100%" height={300} />
        )}
      </SecondColumn>
    </Wrapper>
  )
}

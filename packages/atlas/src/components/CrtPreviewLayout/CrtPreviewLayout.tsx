import BN from 'bn.js'
import { ReactElement, useMemo } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionChevronL, SvgActionNewTab } from '@/assets/icons'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { OutputPill } from '@/components/OutputPill'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { CrtBasicInfoWidget } from '@/components/_crt/CrtBasicInfoWidget'
import { CrtStatusWidget } from '@/components/_crt/CrtStatusWidget'
import { HoldersWidget } from '@/components/_crt/HoldersWidget'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUser } from '@/providers/user/user.hooks'

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
}
export const CrtPreviewLayout = ({
  tokenDetails = <Placeholder height={1000}>Token details</Placeholder>,
  mode,
  token,
}: CrtPreviewViewProps) => {
  const lgMatch = useMediaMatch('lg')
  const { memberId } = useUser()
  const basicDetails = useMemo(() => {
    const details = []
    if (token.totalSupply)
      details.push({
        caption: 'TOTAL REV.',
        content: token.totalSupply,
        icon: <JoyTokenIcon size={16} variant="silver" />,
        tooltipText: 'Lorem ipsum',
      })

    if (token.annualCreatorReward)
      details.push({
        caption: 'REV. SHARE',
        content: `${token.annualCreatorReward}%`,
        tooltipText: 'Lorem ipsum',
      })

    if (token.annualCreatorReward)
      details.push({
        caption: 'AN. REWARD',
        content: `${token.annualCreatorReward}%`,
        tooltipText: 'Lorem ipsum',
      })
    return details
  }, [token])

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
          <HeaderButton variant="tertiary" icon={<SvgActionNewTab />} iconPlacement="right">
            See your token
          </HeaderButton>
        )}
      </HeaderContainer>
      <FirstColumn>{tokenDetails}</FirstColumn>
      <SecondColumn>
        <CrtBasicInfoWidget details={basicDetails} name={token.symbol ?? 'N/A'} />
        {/* todo all props below creationDate are incorrect and should be calucated on orion side */}
        <CrtStatusWidget
          name={token.symbol ?? 'N/A'}
          creationDate={new Date(token.createdAt)}
          supply={new BN(token.totalSupply) ?? 0}
          marketCap={token.annualCreatorReward}
          revenue={token.annualCreatorReward}
          revenueShare={token.annualCreatorReward}
          transactionVolume={token.annualCreatorReward}
        />
        <HoldersWidget tokenId={token.id} ownerId={memberId ?? ''} />
      </SecondColumn>
    </Wrapper>
  )
}

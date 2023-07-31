import BN from 'bn.js'
import { FC } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, transitions } from '@/styles'

import {
  Amount,
  ChannelCardAnchor,
  ChannelCardArticle,
  ChannelTitle,
  InfoWrapper,
  StyledAvatar,
} from './PaidChannelCard.styles'

export type PaidChannelCardProps = {
  onClick?: () => void
  loading?: boolean
  channel?: BasicChannelFieldsFragment
  amount?: BN
}

export const PaidChannelCard: FC<PaidChannelCardProps> = ({ onClick, channel, amount, loading }) => {
  const mdMatch = useMediaMatch('md')

  return (
    <ChannelCardArticle>
      <ChannelCardAnchor onClick={onClick} to={channel?.id ? absoluteRoutes.viewer.channel(channel.id) : ''}>
        <StyledAvatar loading={loading} assetUrls={channel?.avatarPhoto?.resolvedUrls} />
        <SwitchTransition>
          <CSSTransition
            key={loading ? 'placeholder' : 'content'}
            timeout={parseInt(cVar('animationTransitionFast', true))}
            classNames={transitions.names.fade}
          >
            <InfoWrapper>
              {loading || !channel ? (
                <>
                  <SkeletonLoader width={200} height={40} bottomSpace={4} />
                  <SkeletonLoader width={70} height={mdMatch ? 20 : 16} bottomSpace={8} />
                  <SkeletonLoader width={120} height={mdMatch ? 20 : 16} />
                </>
              ) : (
                <>
                  <Amount
                    value={amount ?? 0}
                    as="span"
                    withToken="small"
                    withTooltip
                    withDenomination="vertical"
                    format="short"
                    variant={mdMatch ? 'h300' : 't200-strong'}
                  />

                  <ChannelTitle as="h3" variant={mdMatch ? 'h300' : 't200-strong'}>
                    {channel.title}
                  </ChannelTitle>
                </>
              )}
            </InfoWrapper>
          </CSSTransition>
        </SwitchTransition>
      </ChannelCardAnchor>
    </ChannelCardArticle>
  )
}

import { SvgTierIcon1, SvgTierIcon2, SvgTierIcon3 } from '@/assets/icons'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { formatNumber } from '@/utils/number'

const configTiers = atlasConfig.features.ypp.tiersDefinition?.tiers

export const TIERS = [
  {
    rules: `<${formatNumber(configTiers?.[0].subscribers || 0)} subscribers`,
    icon: <SvgTierIcon1 />,
    subscribers: configTiers?.[0].subscribers,
  },
  {
    rules: `${formatNumber(configTiers?.[1].subscribers || 0)}-${formatNumber(
      configTiers?.[2].subscribers || 0
    )} subscribers`,
    icon: <SvgTierIcon2 />,
    subscribers: configTiers?.[1].subscribers,
  },
  {
    rules: `>${formatNumber(configTiers?.[2].subscribers || 0)} subscribers`,
    icon: <SvgTierIcon3 />,
    subscribers: configTiers?.[2].subscribers,
  },
]

export const REWARDS = [
  {
    title: 'Publish video on Atlas',
    description:
      'Publishing your existing content on Atlas is the fastest way to earn more JOY tokens. Simply follow those steps:',
    actionButton: { text: 'Publish new video', to: absoluteRoutes.studio.videoWorkspace() },
    steps: [
      <>
        Click{' '}
        <Text as="span" variant="t200" color="colorTextStrong">
          “Publish new video”
        </Text>{' '}
        button and proceed to video workspace
      </>,
      <>
        While publishing your new video make sure that all assets like thumbnail, video file, title, description are{' '}
        <Text as="span" variant="t200" color="colorTextStrong">
          the same as used previously on YouTube
        </Text>
      </>,
      'Your uploads will be periodically reviewed for quality and completeness. Videos that match the criteria of programme participation listed above will score towards overall rewards',
    ],
  },
  {
    title: 'Share Atlas video on YouTube',
    description: 'To share Atlas video you need to first upload your own video to the platform.',
    actionButton: { text: 'Go to My videos', to: absoluteRoutes.studio.videos() },
    steps: [
      'Publish new video or select one that you already uploaded to Atlas.',
      'Go to your new video and copy the link to it',
      'Upload a video to your YouTube channel mentioning your channel on Atlas',
      'Place the link in the video description',
    ],
  },
  {
    title: 'Refer another YouTube creator',
    description: 'Earn when another YouTube creator sign up for the program by using your link.',
    actionButton: { text: 'Get referral link' },
    steps: [
      'Copy your link with get referral link button',
      'Send it to the person who you want to recommend',
      'You will be rewarded for every new successful sign up, that uses your referral link to land on the YPP page before signing up',
    ],
  },
]

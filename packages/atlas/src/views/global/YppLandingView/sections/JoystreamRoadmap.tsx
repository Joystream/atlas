import { QuartersData, QuartersListData } from '@/components/AnimatedTimeline'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { HeaderGridItem } from '@/views/global/YppLandingView/YppLandingView.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

export const JoystreamRoadmap = () => {
  const [titleVariant, subtitleVariant] = useSectionTextVariants()
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')

  return (
    <LayoutGrid>
      <HeaderGridItem
        as="header"
        colStart={{ sm: 2 }}
        colSpan={{ base: 12, sm: 10 }}
        data-aos="fade-up"
        data-aos-delay="350"
        data-aos-offset="80"
        data-aos-easing="atlas-easing"
      >
        <Text margin={{ top: smMatch ? 24 : 16 }} variant={titleVariant} as="h3">
          Project Roadmap
        </Text>
        <Text
          variant={mdMatch ? 't500' : subtitleVariant}
          as="p"
          color="colorText"
          data-aos="fade-up"
          data-aos-delay="250"
          data-aos-offset="40"
          data-aos-easing="atlas-easing"
          margin={{ top: 4 }}
        >
          The project is constantly evolving with support of the builders and operators from the Joystream DAO.
        </Text>
      </HeaderGridItem>
      <GridItem colSpan={12}>
        <QuartersListData data={parseQuarters(data)} />
      </GridItem>
    </LayoutGrid>
  )
}

export const parseQuarters = (data: { quarters: QuartersData[] }[]) => {
  if (data.length === 0) return []
  let index = 0
  return data.map((roadmapData) => {
    roadmapData.quarters = roadmapData.quarters.map((quarter) => {
      quarter.deliveryMilestones = quarter.deliveryMilestones.map((milestone) => {
        milestone.generalIndex = index
        index++
        return milestone
      })
      return quarter
    })
    return roadmapData
  })
}

const data: { quarters: QuartersData[] }[] = [
  {
    quarters: [
      {
        'year': '2024',
        'id': 'Q2',
        'deliveryMilestones': [
          {
            'icon': 'exchange',
            'title': 'New Exchange Listings',
            'content':
              'Outreach & discussions with additional cryptocurrency exchanges to provide users with more options for trading the JOY token.',
          },
          {
            'icon': 'bridge',
            'title': 'Ethereum Bridge',
            'content':
              'Development & deployment of a bridging solution on Joystream that will allow for interoperability with Ethereum. In this first version, the goal would be to make JOY accessible on the Ethereum mainnet as an ERC20 token, from which it could be bridged further to other L2s and side-chains. This would allow JOY to be traded, custodied and used with a much wider set of tools.',
          },
          {
            'icon': 'play',
            'title': 'Content Recommendations - v2',
            'content':
              'Surfacing personalized content for a consumer is a key requirement for any content platform. Key product experiences like home screens, feeds and related content, all depend on having modern Machine learning based content recommendation system. Currently Orion has no infrastructure to produce or serve such recommendations, and app recommendations are being done entirely client-side. The goal of this milestone is to ship the first recommendation capability in Orion, to make Joystream apps much more',
          },
          {
            'icon': 'smartphone',
            'title': 'Progressive Web App for Atlas/Gleev',
            'content':
              'Development of a progressive web app for Atlas/Gleev that will allow for the app to be installed on user’s smartphones without having to go through app stores.',
          },
          {
            'icon': 'monitor',
            'title': 'Transcoding & Adaptive Streaming',
            'content':
              'Users access content across a wide range of browser, devices, applications and also under heterogeneous and dynamic bandwidth constraints. As it stands, only a single version of each media asset is represented in our metadata standards and backend node software. This means have now way to represent a broad range of encodings and resolutions for media assets, let alone produce all of these. Introducing server-side transcoding in Orion will unlock this, and many other future benefits that come from server-side post-processing (thumbnail extractions, auto-subtitling, etc.). It will also unlock the ability to do adaptive streaming, where a user with a dynamic connection can more quickly see asset resolve and play, and also be able to watch videos under suboptimal circumstances.',
          },
          {
            'icon': 'metamaskSnap',
            'title': 'Metamask Snap Development',
            'content':
              'The development of a “Metamask Snap” plugin that will enable Joystream assets to be usable by Metamask users.',
          },
          {
            'icon': 'wallet',
            'title': 'New Wallets - v2',
            'content':
              'Implementations with external wallet providers such as hardware & software wallet providers (Tangem, Ledger)',
          },
          {
            'icon': 'content',
            'title': 'API-less YouTube Sync',
            'content':
              'This functionality would enable for channels to sync to Joystream via our YouTube Partner Program without relying on YouTube’s API.',
          },
          {
            'icon': 'channelPayout',
            'title': 'Creator Rewards Program',
            'content':
              "Objective of the program is to offer creators a broader range of activities to be rewarded for. Overall the focus of rewards is shifting from rewards for syncing to holistic engagement and driving the platform growth. As part of the rewards program creators are offered the opportunity to maximize rewards by posting original content to Gleev App ahead of other platforms, and further with utilizing Gleev branding assets. Promoting their channel's NFTs and Tokens on social media and actively participating in the creator's community opens up more additional opportunities for monetizing engagement with Joystream platform.",
          },
          {
            'icon': 'ambassador',
            'title': 'Ambassador Program Expansion - v2',
            'content':
              'Further expansion of our Ambassador program which will include more recruitment and funding for content and engagement by creators.',
          },
        ],
      },
      {
        'year': '2024',
        'id': 'Q3',
        'deliveryMilestones': [
          {
            'icon': 'exchange',
            'title': 'New Exchange Listings',
            'content':
              'Outreach & discussions with additional cryptocurrency exchanges to provide users with more options for trading the JOY token.',
          },
          {
            'icon': 'list',
            'title': 'Playlists',
            'content':
              'A key primitive for organizing content is through playlists. We have developed designs and metadata formats for this a long time ago, but in this milestone we will finally ship the ability for publishing and consuming playlists.',
          },
          {
            'icon': 'premium',
            'title': 'Premium Video Comments & Tips',
            'content':
              'Add functionality for users to leave comments on videos with a tip attached to them that will be sent to the channel owner. This will also enable functionality for users to tip channels and videos directly.',
          },
          {
            'icon': 'stakePool',
            'title': 'Staking Nomination Pools',
            'content':
              'Implementation of on-chain nomination pools which will allow for users to far more easily and quickly stake the JOY token for pooled rewards from other users. This will also provide an important revenue stream for wallet developers and make the Joystream project more attractive to be featured on wallets.',
          },
          {
            'icon': 'premium',
            'title': 'Social Collaboration Features',
            'content':
              "The power of Web3 is in the community ownership and leveraging the network effects. Gleev will offer new ways to organise community based on content verticals and individual channels, adding more utility and new use cases for Creator Tokens and Joy tokens. Channel token holders will be offered exclusive ways to connect with creators, and social feed will empower viewers to co-curate the platform's trending content, gain exposure on the platform and earn JOY tokens for active participation.",
          },
          {
            'icon': 'channelPayout',
            'title': 'Creator Token Improvements',
            'content':
              'Various improvements to creator token functionality such as the addition of public sales, whitelisting and transfer of creator tokens.',
          },
        ],
      },
      {
        'year': '2024',
        'id': 'Q4',
        'deliveryMilestones': [
          {
            'icon': 'exchange',
            'title': 'New Exchange Listings',
            'content':
              'Outreach & discussions with additional cryptocurrency exchanges to provide users with more options for trading the JOY token.',
          },
          {
            'icon': 'community',
            'title': 'Video Communities - v1',
            'content':
              'Launching a new application for your community using Atlas currently requires a lot of deep technical knowledge. You have to obtain hosting and a domain, start the service, configure it, and then maintain it. This is quite difficult. The goal of this milestone is to create the Reddit to phpBB, in terms of the experience of a prospective community creator and moderator. One requires substantially more work and skill. By instead offering a fully hosted and simple point-and-click feature, we can make it orders of magnitude easier to allow third parties to invite their communities to use Joystream.',
          },
          {
            'icon': 'sdk',
            'title': 'Joystream SDK',
            'content':
              'Building on top of Joystream today is still a challenging experience. There are no robust libraries or builder documentation for application development. Offering an excellent experience for developer to build apps, and not just use Atlas off-the shelf, will require a significant investment in building out the SDK. This milestone has as a goal to extract the core of key existing applications, like Atlas and Pioneer, and then to synthesize it all into a new core developer experience, with a suite of excellent tutorials, documentation, examples and also active outreach.',
          },
          {
            'icon': 'lock',
            'title': 'Content Infrastructure: Authentication & Authorization',
            'content':
              'Proper monetization, both for the DAO and individual creators, depends on being able to practically restrict access to content, or make access conditional. Currently, the infrastructure has no awareness of who the consumer is, or the semantics around what the content is, or any associated authorization policy. The goal of this milestone is to introduce basic authentication and authorization at the content layer, enforced by content delivery nodes. This will allow features such as gating videos to only NFT holders for example.',
          },
          {
            'icon': 'dapp',
            'title': 'dApp Operator/Developer Grants & Support',
            'content':
              'Development of a grants program to attract dApp operators and developers to build on the Joystream platform and build our ecosystem.',
          },
          {
            'icon': 'bounty',
            'title': 'Bounties Module',
            'content':
              'Development & deployment of an on-chain bounty management module that will enable bounties to be posted and crowdfunded by users including oracle selection and reward splitting. The council will also have the unique feature of being able to fund bounties that it selects for being of benefit to the platform via the council treasury.',
          },
          {
            'icon': 'contentGating',
            'title': 'Premium Content Gating Features',
            'content':
              'This feature will allow for content creators to restrict access for content to users unless they pay a fee, enabling another revenue stream for premium content.',
          },
          {
            'icon': 'smartphone',
            'title': 'Native Mobile App Development',
            'content': 'Development of a native mobile app for major smartphone platforms.',
          },
        ],
      },
    ],
  },
]
